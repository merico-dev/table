import _ from 'lodash';
import { IObservableArray } from 'mobx';
import { Instance, SnapshotIn, flow, getParent, getRoot, types } from 'mobx-state-tree';
import { CURRENT_SCHEMA_VERSION, QueryMetaSnapshotIn } from '~/model/meta-model';
import { TransformQueryMetaInstance } from '~/model/meta-model/dashboard/content/query/transform-query';
import { typeAssert } from '~/types/utils';
import { downloadDataAsCSV, downloadDataListAsZip, downloadJSON } from '~/utils/download';
import { IContentRenderModel } from '../../../../../dashboard-render';
import { QueryRenderModel, type IQueryRenderModel } from './query';

export const QueriesRenderModel = types
  .model('QueriesRenderModel', {
    current: types.optional(types.array(QueryRenderModel), []),
  })
  .views((self) => ({
    get idSet() {
      return new Set(self.current.map((q) => q.id));
    },
    get firstID() {
      if (self.current.length === 0) {
        return undefined;
      }
      return self.current[0].id;
    },
    findByID(id: string) {
      return self.current.find((query) => query.id === id);
    },
    findByIDSet(idset: Set<string>) {
      return self.current.filter((q) => idset.has(q.id));
    },
    get json() {
      return self.current.filter((o) => o.id && o.key).map((o) => o.json);
    },
    get root() {
      return getRoot(self) as any;
    },
    get dashboardName() {
      return this.root.name;
    },
    get contentModel() {
      // FIXME: type
      return getParent(self, 1) as any;
    },
    get visibleQueryIDSet() {
      const { views, filters } = this.contentModel;
      const queryIDs: string[] = [];

      views.visibleViews.forEach((v: any) => {
        v.panels.forEach((p: any) => {
          queryIDs.push(...p.queryIDs);
        });
      });

      const viewIDs: string[] = _.uniq(views.visibleViews.map((v: any) => v.renderViewIDs).flat());

      filters.current.forEach((f: any) => {
        const id = _.get(f, 'config.options_query_id');
        if (!id) {
          return;
        }

        const visible = viewIDs.some((viewID) => f.visibleInViewsIDSet.has(viewID));
        if (visible) {
          queryIDs.push(id);
        }
      });

      this.findByIDSet(new Set(queryIDs)).forEach((q: IQueryRenderModel) => {
        const config = q.config as TransformQueryMetaInstance;
        if (!q.isTransform || config.dep_query_ids.length === 0) {
          return;
        }
        queryIDs.push(...config.dep_query_ids);
      });

      const ret = new Set(queryIDs);
      console.debug('QueryIDs:', ret);
      return ret;
    },
    isQueryInUse(queryID: string) {
      return this.visibleQueryIDSet.has(queryID);
    },
    addTransformDepQueryIDs(targetSet: Set<string>, excludeSet?: Set<string>) {
      this.findByIDSet(targetSet).forEach((q: IQueryRenderModel) => {
        const config = q.config as TransformQueryMetaInstance;
        if (!q.isTransform || config.dep_query_ids.length === 0) {
          return;
        }
        config.dep_query_ids.forEach((id) => {
          if (excludeSet?.has(id)) {
            return;
          }
          targetSet.add(id);
        });
      });
    },
    get querisToForceReload() {
      const filterQueryIDSet = new Set<string>();
      const panelQueryIDSet = new Set<string>();

      const { views, filters } = this.contentModel;
      const visibleViewIDs: string[] = _.uniq(views.visibleViews.map((v: any) => v.renderViewIDs).flat());

      // make filterQueryIDSet
      filters.current.forEach((f: any) => {
        const id = _.get(f, 'config.options_query_id');
        if (!id) {
          return;
        }

        const visible = visibleViewIDs.some((viewID) => f.visibleInViewsIDSet.has(viewID));
        if (visible) {
          filterQueryIDSet.add(id);
        }
      });
      this.addTransformDepQueryIDs(filterQueryIDSet);

      // make panelQueryIDSet
      views.visibleViews.forEach((v: any) => {
        v.panels.forEach((p: any) => {
          p.queryIDs.forEach((id: string) => {
            if (filterQueryIDSet.has(id)) {
              return;
            }
            panelQueryIDSet.add(id);
          });
        });
      });
      this.addTransformDepQueryIDs(panelQueryIDSet, filterQueryIDSet);

      return {
        filterQueries: this.findByIDSet(filterQueryIDSet),
        panelQueries: this.findByIDSet(panelQueryIDSet),
      };
    },
  }))
  .actions((self) => {
    return {
      downloadAllData() {
        const idDataList = self.current.map(({ name, data }) => ({
          id: name,
          data,
        }));
        downloadDataListAsZip(self.dashboardName, idDataList);
      },
      downloadDataByQueryIDs(filename: string, ids: string[]) {
        if (ids.length === 1) {
          return this.downloadDataByQueryID(filename, ids[0]);
        }
        const idset = new Set(ids);
        const idDataList = self.current
          .filter((q) => idset.has(q.id))
          .map(({ name, data }) => ({
            id: name,
            data,
          }));
        downloadDataListAsZip(filename, idDataList);
      },
      downloadDataByQueryID(filename: string | null, id: string) {
        const query = self.findByID(id);
        if (!query) {
          console.log(`[downloadDataByQueryID] query not found`);
          return;
        }
        const { data } = query;
        const name = filename ?? query.name;
        downloadDataAsCSV(name, data);
      },
      refetchDataByQueryID(queryID: string) {
        const query = self.findByID(queryID);
        if (!query) {
          console.error(new Error(`[downloadDataByQueryID] query by ID[${queryID}] not found`));
          return;
        }
        return query.fetchData(true);
      },
      getSchema(ids: string[]) {
        const queries = self.findByIDSet(new Set(ids));

        const ret = {
          definition: {
            queries: queries.map((q) => q.json),
          },
          version: CURRENT_SCHEMA_VERSION,
        };
        return ret;
      },
      downloadSchema(ids: string[]) {
        const schema = JSON.stringify(this.getSchema(ids), null, 2);
        const filename = 'Queries';
        downloadJSON(filename, schema);
      },
      forceReloadVisibleQueries: flow(function* () {
        const { filterQueries, panelQueries } = self.querisToForceReload;
        console.log('🟡 Force reloading queries');
        if (filterQueries.length > 0) {
          const result = yield Promise.allSettled(filterQueries.map((q) => q.fetchData(true)));
          console.log('🟡 Queries from filters reloaded', result);
        } else {
          console.log('🟡 Found no query from visible filters, skipping');
        }
        if (panelQueries.length > 0) {
          const result = yield Promise.allSettled(panelQueries.map((q) => q.fetchData(true)));
          console.log('🟡 Queries from filters reloaded', result);
        } else {
          console.log('🟡 Found no query from visible panels, skipping');
        }
      }),
    };
  });

export type QueriesRenderModelInstance = Instance<typeof QueriesRenderModel>;
export type QueriesRenderModelSnapshotIn = SnapshotIn<QueriesRenderModelInstance>;

export function getInitialQueriesRenderModel(queries: QueryMetaSnapshotIn[]): QueriesRenderModelSnapshotIn {
  return {
    current: queries,
  };
}

export interface IQueriesRenderModel {
  // Properties
  current: IObservableArray<IQueryRenderModel>;

  // Views
  readonly idSet: Set<string>;
  readonly firstID: string | undefined;
  readonly json: Array<IQueryRenderModel['json']>;
  readonly root: Record<string, unknown>;
  readonly dashboardName: string;
  readonly contentModel: IContentRenderModel;
  readonly visibleQueryIDSet: Set<string>;
  readonly querisToForceReload: {
    filterQueries: IQueryRenderModel[];
    panelQueries: IQueryRenderModel[];
  };

  // Methods
  findByID(id: string): IQueryRenderModel | undefined;
  findByIDSet(idset: Set<string>): IQueryRenderModel[];
  isQueryInUse(queryID: string): boolean;
  addTransformDepQueryIDs(targetSet: Set<string>, excludeSet?: Set<string>): void;
  downloadAllData(): void;
  downloadDataByQueryIDs(filename: string, ids: string[]): void;
  downloadDataByQueryID(filename: string | null, id: string): void;
  refetchDataByQueryID(queryID: string): Promise<void> | void;
  getSchema(ids: string[]): {
    definition: {
      queries: Array<IQueryRenderModel['json']>;
    };
    version: string;
  };
  downloadSchema(ids: string[]): void;
  forceReloadVisibleQueries(): Promise<void>;
}

typeAssert.shouldExtends<IQueriesRenderModel, QueriesRenderModelInstance>();
typeAssert.shouldExtends<QueriesRenderModelInstance, IQueriesRenderModel>();
