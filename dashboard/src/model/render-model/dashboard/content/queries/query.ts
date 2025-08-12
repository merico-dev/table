import axios from 'axios';
import _, { get, map } from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, Instance, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
import { queryByHTTP, queryBySQL, runMetricQuery } from '~/api-caller';
import { TAdditionalQueryInfo } from '~/api-caller/request';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { DataSourceMetaModelInstance } from '~/model/meta-model';
import { DBQueryMetaInstance } from '~/model/meta-model/dashboard/content/query/db-query';
import { TransformQueryMetaInstance } from '~/model/meta-model/dashboard/content/query/transform-query';
import { AnyObject } from '~/types';
import { typeAssert } from '~/types/utils';
import { functionUtils, postProcessWithDataSource, postProcessWithQuery, preProcessWithDataSource } from '~/utils';
import { type IMuteQueryModel, MuteQueryModel } from './mute-query';

type QueryStateType = 'idle' | 'loading' | 'error';

export const QueryRenderModel = types
  .compose(
    'QueryRenderModel',
    MuteQueryModel,
    types.model({
      state: types.optional(types.enumeration<QueryStateType>(['idle', 'loading', 'error']), 'idle'),
      data: types.optional(types.frozen<string[][] | number[][] | AnyObject[]>([]), []),
      error: types.optional(types.frozen<string | null>(), null),
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
    get depQueryModels() {
      const ids = _.get(self, 'config.dep_query_ids', []);
      return self.contentModel.queries.findByIDSet(new Set(ids));
    },
    get depQueryModelStates() {
      return this.depQueryModels.map((q: any) => q.state) as QueryStateType[];
    },
    get depQueryModelStatesString() {
      return this.depQueryModelStates.toString();
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
      return 'data.empty_data';
    },
  }))
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => ({
    setData(data: string[][] | number[][] | AnyObject[]) {
      self.data = data;
    },
    setError(err: string | null) {
      self.error = err;
    },
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
          const config = self.config as DBQueryMetaInstance;
          self.data = yield* toGenerator(
            queryBySQL(
              {
                payload,
                name: self.name,
                query: {
                  type: self.type,
                  key: self.key,
                  sql: config.sql,
                  pre_process: self.pre_process,
                  post_process: self.post_process,
                },
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
            self.error = get(error, 'response.data.detail.message', fallback) as unknown as string | null;
            self.state = 'error';
          } else {
            console.debug(`🟡 Query[${self.name}] is cancelled`);
            self.data = [];
            self.state = 'idle';
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
          const data = postProcessWithQuery(post_process, result, self.contentModel.dashboardStateValues);

          self.data = data;
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          console.error(error);
          if (!axios.isCancel(error)) {
            self.data = [];
            const fallback = get(error, 'message', 'unkown error');
            self.error = get(error, 'response.data.detail.message', fallback) as unknown as string | null;
            self.state = 'error';
          } else {
            console.debug(`🟡 Query[${self.name}] is cancelled`);
            self.data = [];
            self.state = 'idle';
          }
        }
      }),
      runMericoMetricQuery: flow(function* () {
        if (!self.valid || !self.datasource) {
          return;
        }
        self.controller?.abort();
        if (!self.runByConditionsMet) {
          return;
        }
        if (!self.metricQueryPayloadValid) {
          return;
        }

        self.controller = new AbortController();
        self.state = 'loading';
        try {
          const { type, key, post_process } = self.json;
          let config = {
            url: '/api/metric_management/query',
            method: 'POST',
            data: self.metricQueryPayload,
          };
          config = preProcessWithDataSource(self.datasource, config);

          const response = yield* toGenerator(
            runMetricQuery(
              {
                key,
                configString: JSON.stringify(config),
                name: self.name,
                additionals: self.additionalQueryInfo,
              },
              self.controller.signal,
            ),
          );
          const result = postProcessWithDataSource(self.datasource, response);
          const data = postProcessWithQuery(post_process, result, self.contentModel.dashboardStateValues);

          self.data = sortRowKeys(data.data);
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          console.error(error);
          if (!axios.isCancel(error)) {
            self.data = [];
            const fallback = get(error, 'message', 'unkown error');
            self.error = get(error, 'response.data.detail.message', fallback) as unknown as string | null;
            self.state = 'error';
          } else {
            console.debug(`🟡 Query[${self.name}] is cancelled`);
            self.data = [];
            self.state = 'idle';
          }
        }
      }),
      runTransformation() {
        self.state = 'loading';
        try {
          const queries = self.depQueryModels.map((q: QueryRenderModelInstance) => ({
            id: q.id,
            name: q.name,
            data: _.cloneDeep(q.data),
          }));
          const state = self.contentModel.dashboardStateValues;
          const transform = self.pre_process;
          const data = new Function(`return ${transform}`)()(queries, state, functionUtils);
          self.data = data;
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          self.data = [];
          // @ts-expect-error type of error
          self.error = error.message;
          self.state = 'error';
        }
      },
    };
  })
  .actions((self) => {
    return {
      fetchData: (force: boolean) => {
        if (!self.inUse && !force) {
          console.debug(`🟡 Skipping query[${self.name}]`);
          return;
        }
        console.debug(`🔵 Running query[${self.name}]`);
        if (self.isTransform) {
          return self.runTransformation();
        }
        if (self.typedAsHTTP) {
          return self.runHTTP();
        }
        if (self.isMericoMetricQuery) {
          return self.runMericoMetricQuery();
        }
        return self.runSQL();
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
              const config = self.config as TransformQueryMetaInstance;
              const deps = [
                self.inUse,
                self.id,
                self.key,
                self.reQueryKey,
                config.dep_query_ids.toString(),
                self.pre_process,
                self.depQueryModelStatesString,
              ];
              return deps.join('--');
            }
            if (self.typedAsHTTP) {
              return `${self.inUse}--${self.id}--${self.key}--${self.reQueryKey}--${self.datasource?.id}`;
            }
            // TODO: MMS
            if (self.isMericoMetricQuery) {
              return `${self.inUse}--${self.id}--${self.key}--${self.reQueryKey}--${self.metricQueryPayloadString}--${self.datasource?.id}`;
            }
            // NOTE(leto): sql queries don't need datasource info
            const deps = [self.inUse, self.id, self.key, self.formattedSQL, self.pre_process, self.post_process];
            return deps.join('--');
          },
          () => {
            return self.fetchData(false);
          },
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

export interface IQueryRenderModel extends IMuteQueryModel {
  // Properties
  state: QueryStateType;
  data: TQueryData;
  error: string | null;
  controller: AbortController;

  // Views
  readonly datasource: DataSourceMetaModelInstance | DataSourceModelInstance | undefined;

  readonly additionalQueryInfo: TAdditionalQueryInfo;
  readonly depQueryModels: IQueryRenderModel[];
  readonly depQueryModelStates: QueryStateType[];
  readonly depQueryModelStatesString: string;
  readonly stateMessage: string;

  // Actions
  runSQL(): Promise<void>;
  runHTTP(): Promise<void>;
  runMericoMetricQuery(): Promise<void>;
  runTransformation(): void;
  fetchData(force: boolean): Promise<void> | void;
  beforeDestroy(): void;
  afterCreate(): void;
  setData(data: TQueryData): void;
  setError(error: string | null): void;
}

typeAssert.shouldExtends<IQueryRenderModel, QueryRenderModelInstance>();
typeAssert.shouldExtends<QueryRenderModelInstance, IQueryRenderModel>();

export type QueryUsageType =
  | {
      type: 'filter';
      type_label: 'filter.label';
      queryID: string;
      id: string;
      label: string;
      views: { id: string; label: string }[];
    }
  | {
      type: 'panel';
      type_label: 'panel.label';
      queryID: string;
      id: string;
      label: string;
      views: { id: string; label: string }[];
    }
  | {
      type: 'transform-query';
      type_label: 'query.transform.full_label';
      queryID: string;
      id: string;
      label: string;
      views: [];
    };

/**
 * Sort result rows
 * @param data
 */
function sortRowKeys(data: any) {
  if ('sortedColumns' in data && 'result' in data) {
    const sortedColumns = new Set<string>(data.sortedColumns);

    return map(data.result, (item: Record<string, any>) => {
      const row: Record<string, any> = {};
      for (const orderedKey of sortedColumns) {
        row[orderedKey] = item[orderedKey];
      }
      for (const key in item) {
        if (!sortedColumns.has(key)) {
          row[key] = item[key];
        }
      }
      return row;
    });
  }
  return data;
}
