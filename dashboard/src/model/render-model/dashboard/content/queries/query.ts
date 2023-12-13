import axios from 'axios';
import { get } from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, Instance, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
import { queryByHTTP, queryBySQL, QueryFailureError } from '~/api-caller';
import { TAdditionalQueryInfo } from '~/api-caller/request';
import { postProcessWithDataSource, postProcessWithQuery, preProcessWithDataSource } from '~/utils';
import { MuteQueryModel } from './mute-query';

export const QueryRenderModel = types
  .compose(
    'QueryRenderModel',
    MuteQueryModel,
    types.model({
      state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
      data: types.optional(types.frozen<string[][] | number[][]>([]), []),
      error: types.frozen(),
    }),
  )
  .views((self) => ({
    get datasource() {
      const { key, type } = self;
      return self.rootModel.datasources.find({ type, key });
    },
    get additionalQueryInfo(): TAdditionalQueryInfo {
      return self.contentModel.getAdditionalQueryInfo(self.id);
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
          const payload = self.payload;
          self.data = yield* toGenerator(
            queryBySQL(
              {
                payload,
                name: self.name,
                query: self.json,
                additionals: self.additionalQueryInfo,
              },
              self.controller.signal,
            ),
          );
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          if (!axios.isCancel(error)) {
            self.data = [];
            const fallback = get(error, 'message', 'unkown error');
            self.error = get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
            self.state = 'error';
          }
        }
      }),
      runHTTP: flow(function* () {
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
          const { type, key, post_process } = self.json;
          let config = JSON.parse(self.httpConfigString);
          config = preProcessWithDataSource(self.datasource, config);

          const response = yield* toGenerator(
            queryByHTTP(
              {
                type,
                key,
                configString: JSON.stringify(config),
                name: self.name,
                additionals: self.additionalQueryInfo,
              },
              self.controller.signal,
            ),
          );
          const result = postProcessWithDataSource(self.datasource, response);
          const data = postProcessWithQuery(post_process, result, self.contentModel.dashboardState);

          self.data = data;
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          console.error(error);
          if (!axios.isCancel(error)) {
            self.data = [];
            const fallback = get(error, 'message', 'unkown error');
            self.error = get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
            self.state = 'error';
          }
        }
      }),
      runTransformation() {
        console.log('foo');
      },
    };
  })
  .actions((self) => {
    return {
      fetchData: (force: boolean) => {
        if (!self.inUse && !force) {
          console.debug(`Skipping query[${self.name}]`);
          return;
        }
        if (self.isTransform) {
          return self.runTransformation();
        }
        return self.typedAsHTTP ? self.runHTTP() : self.runSQL();
      },

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
            if (self.isTransform) {
              return `${self.inUse}--${self.id}--${self.key}--${''}`; // TODO: add queryIDs & post_process to deps
            }
            if (self.typedAsHTTP) {
              return `${self.inUse}--${self.id}--${self.key}--${self.reQueryKey}--${self.datasource?.id}`;
            }
            // NOTE(leto): sql queries don't need datasource info
            const deps = [self.inUse, self.id, self.key, self.formattedSQL, self.pre_process, self.post_process];
            return deps.join('--');
          },
          () => self.fetchData(false),
          {
            fireImmediately: true,
            delay: 0,
          },
        ),
      );
    },
  }));

export type QueryRenderModelInstance = Instance<typeof QueryRenderModel>;
export type QueryRenderModelSnapshotIn = SnapshotIn<QueryRenderModelInstance>;

export type QueryUsageType =
  | { type: 'filter'; queryID: string; id: string; label: string; views: { id: string; label: string }[] }
  | { type: 'panel'; queryID: string; id: string; label: string; views: { id: string; label: string }[] };
