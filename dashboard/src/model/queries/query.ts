import axios from 'axios';
import { get } from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, getRoot, Instance, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
import { queryByHTTP, queryBySQL, QueryFailureError } from '../../api-caller';
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
    get datasource() {
      const { key, type } = self;
      // @ts-expect-error untyped getRoot(self)
      return getRoot(self).datasources.find({ type, key });
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
      runSQL: flow(function* () {
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
          // @ts-expect-error untyped getRoot(self)
          const { context, mock_context, sqlSnippets, filterValues } = getRoot(self).payloadForSQL;
          self.data = yield* toGenerator(
            queryBySQL(
              {
                context,
                mock_context,
                sqlSnippets,
                title: self.name,
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
            self.error = get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
            self.state = 'error';
          }
        }
      }),
      runHTTP: flow(function* () {
        console.log('runHTTP, ', self.datasource);
        if (!self.valid || !self.datasource) {
          return;
        }
        self.controller?.abort();
        if (!self.runByConditionsMet) {
          return;
        }

        self.controller = new AbortController();
        self.state = 'loading';
        try {
          // @ts-expect-error untyped getRoot(self)
          const { context, mock_context, filterValues } = getRoot(self).payloadForSQL;
          self.data = yield* toGenerator(
            queryByHTTP(
              {
                context,
                mock_context,
                query: self.json,
                filterValues,
                datasource: self.datasource,
              },
              self.controller.signal,
            ),
          );
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          console.error(error);
          if (!axios.isCancel(error)) {
            self.data.length = 0;
            const fallback = get(error, 'message', 'unkown error');
            self.error = get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
            self.state = 'error';
          }
        }
      }),
    };
  })
  .actions((self) => {
    return {
      fetchData: self.typedAsHTTP ? self.runHTTP : self.runSQL,
      beforeDestroy() {
        self.controller?.abort();
      },
    };
  })
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(
          () => {
            if (self.typedAsHTTP) {
              return `${self.id}--${self.key}--${self.pre_process}--${self.post_process}--${self.datasource?.id}`;
            }
            return `${self.id}--${self.key}--${self.formattedSQL}--${self.pre_process}--${self.post_process}--${self.datasource?.id}`;
          },
          self.fetchData,
          {
            fireImmediately: true,
            delay: 0,
          },
        ),
      );
    },
  }));

export type QueryModelInstance = Instance<typeof QueryModel>;
export type QueryModelSnapshotIn = SnapshotIn<QueryModelInstance>;

export type QueryUsageType =
  | { type: 'filter'; id: string; label: string; views: { id: string; label: string }[] }
  | { type: 'panel'; id: string; label: string; views: { id: string; label: string }[] };
