import _ from 'lodash';
import { reaction } from 'mobx';
import { types, cast, addDisposer } from 'mobx-state-tree';
import { QueryModel, QueryModelInstance } from './query';

export const QueriesModel = types
  .model('QueriesModel', {
    original: types.optional(types.array(QueryModel), []),
    current: types.optional(types.array(QueryModel), []),
  })
  .views((self) => ({
    get changed() {
      return !_.isEqual(self.original, self.current);
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
