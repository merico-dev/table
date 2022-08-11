import _ from 'lodash';
import { types, Instance } from 'mobx-state-tree';
import { IDashboard } from '../types';
import { FiltersModel } from './filters';
import { QueriesModel } from './queries';

const DashboardModel = types.model({
  id: types.identifier,
  name: types.string,
  filters: FiltersModel,
  queries: QueriesModel,
});

export function createDashboardModel({ id, name, filters, definition: { queries } }: IDashboard) {
  return DashboardModel.create({
    id,
    name,
    filters: {
      original: filters,
      current: filters,
    },
    queries: {
      original: queries,
      current: queries,
    },
  });
}

export type DashboardModelInstance = Instance<typeof DashboardModel>;
