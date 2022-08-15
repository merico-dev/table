import _ from 'lodash';
import { reaction } from 'mobx';
import { types, cast, addDisposer } from 'mobx-state-tree';
import { downloadCSV, makeCSV } from '../../utils/download';
import { QueryModel, QueryModelInstance } from './query';

export const QueriesModel = types
  .model('QueriesModel', {
    original: types.optional(types.array(QueryModel), []),
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
        self.current = _.cloneDeep(self.original);
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
      afterCreate() {
        addDisposer(
          self,
          reaction(
            () => {
              return self.current.filter((query) => query.valid);
            },
            (queries) => {
              queries.forEach((q) => q.fetchData());
            },
            {
              fireImmediately: true,
            },
          ),
        );
      },
    };
  });

export * from './query';
