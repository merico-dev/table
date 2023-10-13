import _ from 'lodash';
import { Instance, SnapshotIn, getParent, types } from 'mobx-state-tree';
import { QueryMetaSnapshotIn } from '~/model/meta-model';
import { downloadDataAsCSV, downloadDataListAsZip, downloadJSON } from '~/utils/download';
import { QueryRenderModel } from './query';

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
    get contentModel() {
      return getParent(self, 1);
    },
    get visibleQueryIDSet() {
      // FIXME: type
      const { views, filters } = this.contentModel as any;
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

      const ret = new Set(queryIDs);
      console.debug('QueryIDs:', ret);
      return ret;
    },
    isQueryInUse(queryID: string) {
      return this.visibleQueryIDSet.has(queryID);
    },
  }))
  .actions((self) => {
    return {
      downloadAllData() {
        const idDataList = self.current.map(({ name, data }) => ({
          id: name,
          data,
        }));
        downloadDataListAsZip(idDataList);
      },
      downloadDataByQueryIDs(ids: string[]) {
        const idset = new Set(ids);
        const idDataList = self.current
          .filter((q) => idset.has(q.id))
          .map(({ name, data }) => ({
            id: name,
            data,
          }));
        downloadDataListAsZip(idDataList);
      },
      downloadDataByQueryID(id: string) {
        const query = self.findByID(id);
        if (!query) {
          console.log(`[downloadDataByQueryID] query not found`);
          return;
        }
        const { name, data } = query;
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
        };
        return ret;
      },
      downloadSchema(ids: string[]) {
        const schema = JSON.stringify(this.getSchema(ids), null, 2);
        const filename = 'queries';
        downloadJSON(filename, schema);
      },
    };
  });

export type QueriesRenderModelInstance = Instance<typeof QueriesRenderModel>;
export type QueriesRenderModelSnapshotIn = SnapshotIn<QueriesRenderModelInstance>;

export function getInitialQueriesRenderModel(queries: QueryMetaSnapshotIn[]): QueriesRenderModelSnapshotIn {
  return {
    current: queries,
  };
}
