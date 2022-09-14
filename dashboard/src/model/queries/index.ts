import _ from 'lodash';
import { types, cast } from 'mobx-state-tree';
import { downloadCSV, makeCSV, downloadDataListAsZip } from '../../utils/download';
import { QueryModel, QueryModelInstance } from './query';
import { MuteQueryModel } from './mute-query';

export const QueriesModel = types
  .model('QueriesModel', {
    original: types.optional(types.array(MuteQueryModel), []),
    current: types.optional(types.array(QueryModel), []),
  })
  .views((self) => ({
    get changed() {
      if (self.original.length !== self.current.length) {
        return true;
      }
      return self.original.some((o, i) => {
        return !_.isEqual(o.configurations, self.current[i].configurations);
      });
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
    get options() {
      return self.current.map((d) => ({
        value: d.id,
        label: d.id,
      }));
    },
  }))
  .actions((self) => {
    return {
      reset() {
        self.current = cast(
          self.original.map((o) => ({
            ...o,
            state: 'idle',
            data: [],
            error: null,
          })),
        );
      },
      replace(current: Array<QueryModelInstance>) {
        self.current = cast(current);
      },
      append(item: QueryModelInstance) {
        self.current.push(item);
      },
      remove(index: number) {
        self.current.splice(index, 1);
      },
      replaceByIndex(index: number, replacement: QueryModelInstance) {
        self.current.splice(index, 1, replacement);
      },
      downloadAllData() {
        const idDataList = self.current.map(({ id, data }) => ({
          id,
          data: data.toJSON(),
        }));
        downloadDataListAsZip(idDataList);
      },
      downloadDataByQueryID(queryID: string) {
        const query = self.findByID(queryID);
        if (!query) {
          console.log(`[downloadDataByQueryID] query by ID[${queryID}] not found`);
          return;
        }
        const { id, data } = query;
        const csv = makeCSV(data);
        downloadCSV(id, csv);
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

export * from './query';
