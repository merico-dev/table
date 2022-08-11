import _ from 'lodash';
import { types, Instance } from 'mobx-state-tree';
import { IDashboard } from '../types';
import { FiltersModel } from './filters';
import { QueriesModel } from './queries';
import { SQLSnippetsModel } from './sql-snippets';

const DashboardModel = types.model({
  id: types.identifier,
  name: types.string,
  filters: FiltersModel,
  queries: QueriesModel,
  sqlSnippets: SQLSnippetsModel,
});

export function createDashboardModel({ id, name, filters, definition: { queries, sqlSnippets } }: IDashboard) {
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
    sqlSnippets: {
      original: sqlSnippets,
      current: sqlSnippets,
    },
  });
}

export function createEmptyDashboardModel() {
  return DashboardModel.create({
    id: 'initial',
    name: '',
    filters: {
      original: [],
      current: [],
    },
    queries: {
      original: [],
      current: [],
    },
    sqlSnippets: {
      original: [],
      current: [],
    },
  });
}

export type DashboardModelInstance = Instance<typeof DashboardModel>;
