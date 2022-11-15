import { reaction } from 'mobx';
import { addDisposer, flow, getRoot, Instance, toGenerator, types } from 'mobx-state-tree';
import { queryBySQL, QueryFailureError } from '../../api-caller';
import { explainSQL } from '../../utils/sql';
import { MuteQueryModel } from './mute-query';
import { DataSourceType } from './types';

export const QueryModel = types
  .compose(
    'QueryModel',
    MuteQueryModel,
    types.model({
      state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
      data: types.optional(types.array(types.frozen<string[] | number[]>()), []),
      error: types.frozen(),
    }),
  )
  .views((self) => ({
    get formattedSQL() {
      // @ts-expect-error untyped getRoot(self)
      const { context, mock_context, sqlSnippets, filterValues } = getRoot(self).payloadForSQL;
      return explainSQL(self.sql, context, mock_context, sqlSnippets, filterValues);
    },
  }))
  .views((self) => ({
    get json() {
      const { id, type, key, sql } = self;
      return {
        id,
        type,
        key,
        sql,
      };
    },
  }))
  .actions((self) => ({
    setID(id: string) {
      self.id = id;
    },
    setKey(key: string) {
      self.key = key;
    },
    setType(type: DataSourceType) {
      self.type = type;
    },
    setSQL(sql: string) {
      self.sql = sql;
    },
    fetchData: flow(function* () {
      if (!self.valid) {
        return;
      }
      self.state = 'loading';
      try {
        const title = self.id;
        // @ts-expect-error untyped getRoot(self)
        const { context, mock_context, sqlSnippets, filterValues } = getRoot(self).payloadForSQL;
        self.data = yield* toGenerator(
          queryBySQL({
            context,
            mock_context,
            sqlSnippets,
            title,
            query: {
              type: self.type,
              key: self.key,
              sql: self.sql,
            },
            filterValues,
          }),
        );
        self.state = 'idle';
        self.error = null;
      } catch (error) {
        self.data.length = 0;
        // @ts-expect-error Object is of type 'unknown'
        const resp = error.response.data as QueryFailureError;
        self.error = resp.detail.message;
        self.state = 'error';
      }
    }),
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => `${self.id}--${self.key}--${self.type}--${self.formattedSQL}`, self.fetchData, {
          fireImmediately: true,
          delay: 500,
        }),
      );
    },
  }));

export type QueryModelInstance = Instance<typeof QueryModel>;
