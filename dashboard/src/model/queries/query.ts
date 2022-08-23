import { reaction } from 'mobx';
import { addDisposer, flow, getRoot, Instance, toGenerator, types } from 'mobx-state-tree';
import { queryBySQL } from '../../api-caller';
import { explainSQL } from '../../utils/sql';
import { MuteQueryModel } from './mute-query';
import { DataSourceType } from './types';

export const QueryModel = types
  .compose(
    'QueryModel',
    MuteQueryModel,
    types.model({
      state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
      data: types.optional(types.array(types.frozen<Object>()), []),
      error: types.frozen(),
    }),
  )
  .views((self) => ({
    get formattedSQL() {
      // @ts-expect-error
      const { context, sqlSnippets, filterValues } = getRoot(self).payloadForSQL;
      return explainSQL(self.sql, context, sqlSnippets, filterValues);
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
        // @ts-expect-error
        const { context, sqlSnippets, filterValues } = getRoot(self).payloadForSQL;
        self.data = yield* toGenerator(
          queryBySQL({
            context,
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
      } catch (error) {
        console.error(error);
        self.error = error;
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
