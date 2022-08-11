import _ from 'lodash';
import { types, Instance } from 'mobx-state-tree';
import { IDashboard } from '../types';
import { FiltersModel } from './filters';

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
