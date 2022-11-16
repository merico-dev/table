import { addDisposer, applyPatch, Instance, onSnapshot, types } from 'mobx-state-tree';
import { IDashboard } from '../types';
import { ContextInfoType, ContextModel } from './context';
import { FiltersModel, getInitialFiltersPayload } from './filters';
import { MockContextModel } from './mock-context';
import { QueriesModel } from './queries';
import { SQLSnippetsModel } from './sql-snippets';
import { createDashboardViewsModel, ViewsModel } from './views';

export const DashboardModel = types
  .model({
    id: types.identifier,
    name: types.string,
    filters: FiltersModel,
    queries: QueriesModel,
    sqlSnippets: SQLSnippetsModel,
    views: ViewsModel,
    context: ContextModel,
    mock_context: MockContextModel,
  })
  .views((self) => ({
    get payloadForSQL() {
      return {
        context: self.context.current,
        mock_context: self.mock_context.current,
        sqlSnippets: self.sqlSnippets.current,
        filterValues: self.filters.values,
      };
    },
    get data() {
      const data = self.queries.current.map(({ id, data }) => ({ id, data }));
      return data.reduce((ret, curr) => {
        ret[curr.id] = curr.data;
        return ret;
      }, {} as Record<string, $TSFixMe[]>);
    },
    getDataStuffByID(queryID: string) {
      const q = self.queries.findByID(queryID);
      if (!q) {
        return {
          data: [],
          state: 'idle',
          error: undefined,
        };
      }
      return {
        data: q.data.toJSON(),
        state: q.state,
        error: q.error,
      };
    },
    getDataStateByID(queryID: string) {
      return self.queries.findByID(queryID)?.state ?? [];
    },
    getDataErrorByID(queryID: string) {
      return self.queries.findByID(queryID)?.error ?? [];
    },
  }))
  .views((self) => ({
    findDependingPanels(queryID: string) {
      return self.views.current.flatMap((v) =>
        v.panels.list.filter((p) => p.queryID.id === queryID).map((p) => p.title),
      );
    },
  }))
  .actions((self) => {
    function setupAutoSave() {
      const filterPayloadKey = `dashboard-${self.id}-filters`;
      try {
        const storedValue = localStorage.getItem(filterPayloadKey);
        if (storedValue) {
          const storedFilters = JSON.parse(storedValue);
          applyPatch(self.filters, {
            op: 'replace',
            path: '/values',
            value: storedFilters,
          });
        }
      } catch (e) {
        console.log(e);
        // ignore
      }
      const autoSave = onSnapshot(self.filters, (snapshot) => {
        localStorage.setItem(filterPayloadKey, JSON.stringify(snapshot.values));
      });
      addDisposer(self, autoSave);
    }

    return {
      afterCreate() {
        setupAutoSave();
      },
    };
  });

export function createDashboardModel(
  { id, name, filters, views, definition: { queries, sqlSnippets, mock_context = {} } }: IDashboard,
  context: ContextInfoType,
) {
  return DashboardModel.create({
    id,
    name,
    filters: getInitialFiltersPayload(filters),
    queries: {
      original: queries,
      current: queries,
    },
    sqlSnippets: {
      original: sqlSnippets,
      current: sqlSnippets,
    },
    context: {
      current: context,
    },
    mock_context: {
      original: mock_context,
      current: mock_context,
    },
    views: createDashboardViewsModel(views),
  });
}

export type DashboardModelInstance = Instance<typeof DashboardModel>;
