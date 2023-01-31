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
    get typedAsSQL() {
      return [DataSourceType.Postgresql, DataSourceType.MySQL].includes(self.type);
    },
    get typedAsHTTP() {
      return [DataSourceType.HTTP].includes(self.type);
    },
  }))
  .views((self) => ({
    get stateMessage() {
      if (self.state !== 'idle') {
        return '';
      }
      if (!self.runByConditionsMet) {
        const { context, filters } = self.conditionNames;
        if (context.length === 0 && filters.length === 0) {
          return 'Waiting';
        }
        const arr = [];
        if (context.length > 0) {
          arr.push(`context: ${context.join(', ')}`);
        }
        if (filters.length > 0) {
          arr.push(`filter${filters.length > 1 ? 's' : ''}: ${filters.join(', ')}`);
        }
        if (arr.length === 2) {
          arr.splice(1, 0, 'and');
        }
        arr.unshift('Waiting for');
        return arr.join(' ');
      }
      if (self.data.length > 0) {
        return '';
      }
      return 'Empty Data';
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
      setPreProcess(v: string) {
        self.pre_process = v;
      },
      setPostProcess(v: string) {
        self.post_process = v;
      },
      fetchData: flow(function* () {
        if (!self.valid) {
          return;
        }
        self.controller?.abort();
        if (!self.runByConditionsMet) {
          return;
        }

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
            const fallback = get(error, 'message', 'unkown error');
            self.error = get(error, 'response.data.detail.message', fallback) as QueryFailureError;
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
