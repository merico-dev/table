import _ from 'lodash';
import { types } from 'mobx-state-tree';
import { IDashboard } from '../types';
import { FilterModel } from './filter';

const FiltersModel = types
  .model('FiltersModel', {
    original: types.array(FilterModel),
    current: types.array(FilterModel),
  })
  .views((self) => ({
    get changed() {
      return !_.isEqual(self.original, self.current);
    },
  }))
  .actions((self) => {
    return {
      reset() {
        self.current = _.cloneDeep(self.original);
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
