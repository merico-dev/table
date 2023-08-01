import { Instance, types } from 'mobx-state-tree';
import { QueryRenderModel } from './query';
import { downloadCSV, downloadDataListAsZip, makeCSV } from '~/utils/download';

export const QueriesRenderModel = types
  .model('QueriesRenderModel', {
    current: types.optional(types.array(QueryRenderModel), []),
  })
  .views((self) => ({
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
      return self.current.filter((o) => o.id).map((o) => o.json);
    },
  }))
  .actions((self) => {
    return {
      downloadAllData() {
        const idDataList = self.current.map(({ name, data }) => ({
          id: name,
          data: data.toJSON(),
        }));
        downloadDataListAsZip(idDataList);
      },
      downloadDataByQueryIDs(ids: string[]) {
        const idset = new Set(ids);
        const idDataList = self.current
          .filter((q) => idset.has(q.id))
          .map(({ name, data }) => ({
            id: name,
            data: data.toJSON(),
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
        const csv = makeCSV(data);
        downloadCSV(name, csv);
      },
      refetchDataByQueryID(queryID: string) {
        const query = self.findByID(queryID);
        if (!query) {
          console.error(new Error(`[downloadDataByQueryID] query by ID[${queryID}] not found`));
          return;
        }
        return query.fetchData();
      },
    };
  });

export type QueriesRenderModelInstance = Instance<typeof QueriesRenderModel>;
