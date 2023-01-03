import axios from 'axios';
import _, { get } from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, getRoot, Instance, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
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
    get conditionOptions() {
      // @ts-expect-error untyped getRoot(self)
      const { context, mock_context, filterValues } = getRoot(self).payloadForSQL;
      const contextOptions = Object.keys({ ...mock_context, ...context }).map((k) => `context.${k}`);
      const filterOptions = Object.keys(filterValues).map((k) => `filters.${k}`);
      const keys = [...contextOptions, ...filterOptions];
      return keys.map((k) => ({
        label: k.split('.')[1],
        value: k,
        group: _.capitalize(k.split('.')[0]),
      }));
    },
    get runByConditionsMet() {
      const { run_by } = self;
      if (run_by.length === 0) {
        return true;
      }
      // @ts-expect-error untyped getRoot(self)
      const { context, mock_context, filterValues } = getRoot(self).payloadForSQL;
      const payload = {
        context: {
          ...mock_context,
          ...context,
        },
        filters: filterValues,
      };

      return run_by.every((c) => {
        const value = _.get(payload, c);
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return !!value;
      });
    },
  }))
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => {
    return {
      setName(name: string) {
        self.name = name;
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
      setRunBy(v: string[]) {
        self.run_by.length = 0;
        self.run_by.push(...v);
      },
      fetchData: flow(function* () {
        if (!self.valid || !self.runByConditionsMet) {
          return;
        }
        self.controller?.abort();
        self.controller = new AbortController();
        self.state = 'loading';
        try {
          const title = self.id;
          // @ts-expect-error untyped getRoot(self)
          const { context, mock_context, sqlSnippets, filterValues } = getRoot(self).payloadForSQL;
          self.data = yield* toGenerator(
            queryBySQL(
              {
                context,
                mock_context,
                sqlSnippets,
                title,
                query: self.json,
                filterValues,
              },
              self.controller.signal,
            ),
          );
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          if (!axios.isCancel(error)) {
            self.data.length = 0;
            self.error = get(error, 'response.data.detail.message', 'unknown error') as QueryFailureError;
            self.state = 'error';
          }
        }
      }),
      beforeDestroy() {
        self.controller?.abort();
      },
    };
  })
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => `${self.id}--${self.key}--${self.type}--${self.formattedSQL}`, self.fetchData, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));

export type QueryModelInstance = Instance<typeof QueryModel>;
export type QueryModelSnapshotIn = SnapshotIn<QueryModelInstance>;
