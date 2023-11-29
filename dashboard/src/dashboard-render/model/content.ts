import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  addDisposer,
  applyPatch,
  getParent,
  onSnapshot,
  types,
} from 'mobx-state-tree';
import { TAdditionalQueryInfo } from '~/api-caller/request';
import {
  CURRENT_SCHEMA_VERSION,
  FiltersRenderModel,
  MockContextMeta,
  PanelsRenderModel,
  QueriesRenderModel,
  SQLSnippetsRenderModel,
  TPayloadForSQL,
  TPayloadForViz,
  ViewsRenderModel,
  formatSQLSnippet,
  getInitialFiltersConfig,
  getInitialMockContextMeta,
  getInitialQueriesRenderModel,
  getInitialSQLSnippetsRenderModel,
  getInitialViewsRenderModel,
} from '~/model';
import { DashboardContentDBType } from '~/types';
import { payloadToDashboardState } from '~/utils/dashboard-state';

export const ContentRenderModel = types
  .model({
    id: types.string,
    name: types.string,
    dashboard_id: types.string,
    create_time: types.string,
    update_time: types.string,
    version: types.string, // schema version
    filters: FiltersRenderModel,
    queries: QueriesRenderModel,
    sqlSnippets: SQLSnippetsRenderModel,
    views: ViewsRenderModel,
    panels: PanelsRenderModel,
    mock_context: MockContextMeta,
  })
  .views((self) => ({
    get json(): DashboardContentDBType {
      return {
        id: self.id,
        name: self.name,
        create_time: self.create_time,
        update_time: self.update_time,
        dashboard_id: self.dashboard_id,
        content: {
          views: self.views.json,
          panels: self.panels.json,
          filters: self.filters.json,
          version: self.version,
          definition: {
            queries: self.queries.json,
            sqlSnippets: self.sqlSnippets.json,
            mock_context: self.mock_context.current,
          },
        },
      };
    },
    get contentJSON(): DashboardContentDBType['content'] {
      return this.json.content;
    },
    get payloadForSQL(): TPayloadForSQL {
      // @ts-expect-error type of getParent
      const context = getParent(self).context.current;
      // @ts-expect-error type of getParent
      const global_sql_snippets = getParent(self).globalSQLSnippets;

      const params = {
        context: {
          ...self.mock_context.current,
          ...context,
        },
        filters: self.filters.values,
      };
      return {
        ...params,
        sql_snippets: formatSQLSnippet(self.sqlSnippets.current, 'key', 'value', params),
        global_sql_snippets: formatSQLSnippet(global_sql_snippets.list, 'id', 'content', params),
      };
    },
    get payloadForViz() {
      // @ts-expect-error type of getParent
      const context = getParent(self).context.current;

      return {
        context: {
          ...self.mock_context.current,
          ...context,
        },
        filters: self.filters.values,
      } as TPayloadForViz;
    },
    get dashboardState() {
      return payloadToDashboardState(this.payloadForSQL);
    },
    getAdditionalQueryInfo(query_id: string): TAdditionalQueryInfo {
      return { content_id: self.id, query_id, params: this.dashboardState };
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
          len: 0,
          state: 'idle',
          error: undefined,
        };
      }
      return {
        data: q.data,
        len: q.data.length,
        state: q.state,
        error: q.error,
      };
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
      // FIXME: https://github.com/merico-dev/table/issues/440
      // afterCreate() {
      //   setupAutoSave();
      // },
    };
  });

export type ContentRenderModelInstance = Instance<typeof ContentRenderModel>;
export type ContentRenderModelCreationType = SnapshotIn<ContentRenderModelInstance>;
export type ContentRenderModelSnapshotType = SnapshotOut<ContentRenderModelInstance>;

export function createContentRenderModel({
  id,
  name,
  dashboard_id,
  create_time,
  update_time,
  content,
}: DashboardContentDBType) {
  if (!content) {
    throw new Error('unexpected null content when creating a content model');
  }

  const {
    version,
    filters,
    views,
    panels,
    definition: { queries, sqlSnippets, mock_context = {} },
  } = content;
  return ContentRenderModel.create({
    id,
    name,
    dashboard_id,
    create_time,
    update_time,
    version,
    filters: getInitialFiltersConfig(filters),
    queries: getInitialQueriesRenderModel(queries),
    sqlSnippets: getInitialSQLSnippetsRenderModel(sqlSnippets),
    mock_context: getInitialMockContextMeta(mock_context),
    views: getInitialViewsRenderModel(views),
    panels: {
      list: panels,
    },
  });
}
