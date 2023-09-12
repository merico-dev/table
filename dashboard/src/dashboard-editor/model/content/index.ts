import _, { defaults, get, isEqual, pick } from 'lodash';
import {
  addDisposer,
  applyPatch,
  applySnapshot,
  castToSnapshot,
  getParent,
  getSnapshot,
  Instance,
  onSnapshot,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { AnyObject, DashboardContentDBType, TDashboardContent } from '~/types';

import { FiltersModel } from '../filters';
import { QueriesModel } from '../queries';
import { SQLSnippetsModel } from '../sql-snippets';

import {
  formatSQLSnippet,
  getInitialFiltersConfig,
  getInitialMockContextMeta,
  getNewPanel,
  MockContextMeta,
  QueryUsageType,
  SQLSnippetUsageType,
  TPayloadForSQL,
  TPayloadForViz,
} from '~/model';
import { PanelModelInstance, PanelsModel } from '../panels';
import { getInitialDashboardViewsModel, ViewsModel } from '../views';

const _ContentModel = types
  .model({
    id: types.string,
    name: types.string,
    dashboard_id: types.string,
    create_time: types.string,
    update_time: types.string,
    version: types.string, // schema version
    filters: FiltersModel,
    queries: QueriesModel,
    sqlSnippets: SQLSnippetsModel,
    views: ViewsModel,
    panels: PanelsModel,
    mock_context: MockContextMeta,
    /**
     * this field should be excluded from snapshot
     */
    origin: types.maybe(types.frozen()),
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
    get filtersChanged() {
      const fields = 'filters.current';
      return !isEqual(getSnapshot(get(self, fields)), get(self.origin, fields));
    },
    get queriesChanged() {
      const fields = 'queries.current';
      const snapshot = (getSnapshot(get(self, fields)) as AnyObject[]).map((it: $TSFixMe) =>
        pick(it, ['id', 'name', 'key', 'type', 'sql', 'run_by', 'react_to', 'pre_process', 'post_process']),
      );
      return !isEqual(snapshot, get(self.origin, fields));
    },
    get sqlSnippetsChanged() {
      const fields = 'sqlSnippets.current';
      return !isEqual(getSnapshot(get(self, fields)), get(self.origin, fields));
    },
    get viewsChanged() {
      const fields = 'views.current';
      return !isEqual(self.views.json, get(self.origin, fields));
    },
    get panelsChanged() {
      const fields = 'panels.list';
      return !isEqual(getSnapshot(get(self, fields)), get(self.origin, fields));
    },
    get mockContextChanged() {
      const fields = 'mock_context.current';
      return !isEqual(get(self, fields), get(self.origin, fields));
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
    get changed() {
      return (
        this.filtersChanged ||
        this.queriesChanged ||
        this.sqlSnippetsChanged ||
        this.viewsChanged ||
        this.panelsChanged ||
        this.mockContextChanged
      );
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
  .views((self) => ({
    get queriesUsage() {
      const panelIDMap = self.panels.idMap;
      const usages: QueryUsageType[] = [];
      self.views.current.forEach((v) => {
        v.panelIDs.forEach((pid) => {
          const p = panelIDMap.get(pid);
          if (!p) {
            return;
          }

          const type = 'panel';
          const label = p.title ? p.title : p.viz.type;
          const views = [
            {
              id: v.id,
              label: v.name,
            },
          ];
          p.queryIDs.forEach((queryID) => {
            usages.push({
              id: pid,
              queryID,
              type,
              label,
              views,
            });
          });
        });
      });

      const viewIDMap = self.views.idMap;
      self.filters.current
        .filter((f) => {
          const filterQueryID = _.get(f, 'config.options_query_id');
          return !!filterQueryID;
        })
        .map((f) => ({
          type: 'filter',
          id: f.id,
          queryID: _.get(f, 'config.options_query_id'),
          label: f.label,
          views: f.visibleInViewsIDs.map((id) => ({
            id,
            label: viewIDMap.get(id)?.name ?? id,
          })),
        }));

      return _.groupBy(usages, 'queryID');
    },
    get hasUnusedQueries() {
      return self.queries.current.length > Object.keys(this.queriesUsage).length;
    },
    findQueryUsage(queryID: string) {
      return this.queriesUsage[queryID] ?? [];
    },
    get sqlSnippetsUsage() {
      const usages: SQLSnippetUsageType[] = [];
      const reg = /(?<=sql_snippets\.)([^}.]+)/gm;
      self.queries.current.forEach((q) => {
        if (!q.typedAsSQL) {
          return;
        }
        const keys = _.uniq(q.sql.match(reg));
        keys.forEach((k) => {
          usages.push({
            queryID: q.id,
            sqlSnippetKey: k,
            queryName: q.name,
          });
        });
      });

      return _.groupBy(usages, 'sqlSnippetKey');
    },
    get hasUnusedSQLSnippets() {
      return self.sqlSnippets.current.length > Object.keys(this.sqlSnippetsUsage).length;
    },
    findSQLSnippetUsage(key: string) {
      return this.sqlSnippetsUsage[key] ?? [];
    },
  }))
  .actions((self) => ({
    removeUnusedQueries() {
      const usedQueries = new Set(Object.keys(self.queriesUsage));
      const ids = self.queries.current.filter((q) => !usedQueries.has(q.id)).map((q) => q.id);
      self.queries.removeQueries(ids);
    },
    duplicatePanelByID(panelID: string, viewID: string) {
      const newID = self.panels.duplicateByID(panelID);
      if (!newID) {
        return;
      }

      self.views.findByID(viewID)?.appendPanelID(newID);
    },
    removePanelByID(panelID: string, viewID: string) {
      self.panels.removeByID(panelID);
      self.views.findByID(viewID)?.removePanelID(panelID);
    },
    addANewPanel(viewID: string) {
      const id = new Date().getTime().toString();
      self.panels.append(getNewPanel(id));
      self.views.findByID(viewID)?.appendPanelID(id);
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
      reset() {
        applySnapshot(self.filters.current, self.origin.filters.current);
        applySnapshot(self.queries.current, self.origin.queries.current);
        applySnapshot(self.sqlSnippets.current, self.origin.sqlSnippets.current);
        applySnapshot(self.views.current, self.origin.views.current);
        applySnapshot(self.panels.list, self.origin.panels.list);
        self.mock_context.current = self.origin.mock_context.current;
      },
      resetFilters() {
        applySnapshot(self.filters.current, self.origin.filters.current);
      },
      updateCurrent(config: DashboardContentDBType) {
        const { id, name, content } = config;
        if (!content) {
          throw new Error('unexpected null content when updating a content model');
        }
        const {
          version,
          filters,
          views,
          panels,
          definition: { queries, sqlSnippets, mock_context = {} },
        } = content;

        self.id = id;
        self.name = name;
        self.version = version;
        applySnapshot(self.filters.current, filters);
        applySnapshot(self.views.current, getInitialDashboardViewsModel(views).current);
        applySnapshot(self.panels.list, panels);
        applySnapshot(self.queries.current, queries);
        applySnapshot(self.sqlSnippets.current, sqlSnippets);
        self.mock_context.current = mock_context;
      },
    };
  });

type _ContentModelType = typeof _ContentModel;
type ContentModelCreationType = SnapshotIn<Instance<_ContentModelType>>;
type ContentModelSnapshotType = SnapshotOut<Instance<_ContentModelType>>;

export const ContentModel = types.snapshotProcessor<
  _ContentModelType,
  ContentModelCreationType,
  ContentModelSnapshotType
>(_ContentModel, {
  preProcessor(sn: ContentModelCreationType): ContentModelCreationType {
    return {
      ...sn,
      origin: sn,
    } as ContentModelCreationType;
  },
  postProcessor(sn: Omit<ContentModelSnapshotType, symbol>): ContentModelSnapshotType {
    delete sn.origin;
    // only preserve id, key, type, sql fields in sn.queries.current
    // or do we need to add postProcessor for QueryModel?
    const queries = castToSnapshot(sn.queries.current.map((q) => pick(q, ['id', 'key', 'type', 'sql'])));
    return defaults({}, { queries: { current: queries } }, sn);
  },
});

export type PatchableContent = Partial<Pick<TDashboardContent, 'filters'>>;

export function applyPartialDashboard(model: ContentModelInstance, changes: PatchableContent) {
  if (changes.filters) {
    applySnapshot(model.filters.current, changes.filters);
  }
}

export function createContentModel({
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
  return ContentModel.create({
    id,
    name,
    dashboard_id,
    create_time,
    update_time,
    version,
    filters: getInitialFiltersConfig(filters),
    queries: {
      current: queries,
    },
    sqlSnippets: {
      current: sqlSnippets,
    },
    mock_context: getInitialMockContextMeta(mock_context),
    views: getInitialDashboardViewsModel(views),
    panels: {
      list: panels,
    },
  });
}

export type ContentModelInstance = Instance<typeof ContentModel>;
