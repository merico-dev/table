import _ from 'lodash';
import { types, cast } from 'mobx-state-tree';
import { FilterModel, FilterModelInstance } from './filter';

export const FiltersModel = types
  .model('FiltersModel', {
    original: types.optional(types.array(FilterModel), []),
    current: types.optional(types.array(FilterModel), []),
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
  }))
  .actions((self) => {
    return {
      reset() {
        self.current = _.cloneDeep(self.original);
      },
      replace(current: Array<FilterModelInstance>) {
        self.current = cast(current);
      },
      append(item: FilterModelInstance) {
        self.current.push(item);
      },
      remove(index: number) {
        self.current.splice(index, 1);
      },
    };
  });

export * from './filter';
