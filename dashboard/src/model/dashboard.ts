import _ from 'lodash';
import { types, cast, Instance } from 'mobx-state-tree';
import { IDashboard } from '../types';
import { FilterModel, FilterModelInstance } from './filter';

const FiltersModel = types
  .model('FiltersModel', {
    original: types.optional(types.array(FilterModel), []),
    current: types.optional(types.array(FilterModel), []),
  })
  .views((self) => ({
    get changed() {
      return !_.isEqual(self.original, self.current);
    },
    get len() {
      return self.current.length
    }
  }))
  .actions((self) => {
    return {
      reset() {
        self.current = _.cloneDeep(self.original);
      },
      setCurrent(current: Array<FilterModelInstance>) {
        self.current = cast(current);
      },
    };
  });

const DashboardModel = types.model({
  id: types.identifier,
  name: types.string,
  filters: FiltersModel,
});

export function createDashboardModel({ id, name, filters }: IDashboard) {
  return DashboardModel.create({
    id,
    name,
    filters: {
      original: filters,
      current: filters,
    },
  });
}

export type DashboardModelInstance = Instance<typeof DashboardModel>;
