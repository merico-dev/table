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

import { FiltersModel, FilterUsageType } from '../filters';
import { QueriesModel } from '../queries';
import { SQLSnippetsModel } from '../sql-snippets';

import { v4 as uuidv4 } from 'uuid';
import { TAdditionalQueryInfo } from '~/api-caller/request';
import {
  ContextRecordType,
  formatSQLSnippet,
  getInitialFiltersConfig,
  getInitialMockContextMeta,
  getNewPanel,
  LayoutItem,
  MockContextMeta,
  QueryUsageType,
  SQLSnippetUsageType,
  TPayloadForSQL,
  TPayloadForViz,
} from '~/model';
import { DBQueryMetaInstance } from '~/model/meta-model/dashboard/content/query/db-query';
import { TransformQueryMetaInstance } from '~/model/meta-model/dashboard/content/query/transform-query';
import { payloadToDashboardStateValues, UsageRegs } from '~/utils';
import { LayoutsModel } from '../layouts';
import { PanelsModel } from '../panels';
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
    layouts: LayoutsModel,
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
          layouts: self.layouts.json,
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
    get filtersChanged() {
      const fields = 'filters.current';
      return !isEqual(getSnapshot(get(self, fields)), get(self.origin, fields));
    },
    get queriesChanged() {
      const fields = 'queries.current';
      const snapshot = (getSnapshot(get(self, fields)) as AnyObject[]).map((it: $TSFixMe) =>
        pick(it, ['id', 'name', 'key', 'type', 'run_by', 'pre_process', 'post_process', 'config']),
      );
      const original = get(self.origin, fields);
      return !isEqual(snapshot, original);
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
    get layoutsChanged() {
      const fields = 'layouts.list';
      return !isEqual(getSnapshot(get(self, fields)), get(self.origin, fields));
    },
    get mockContextChanged() {
      const fields = 'mock_context.current';
      return !isEqual(get(self, fields), get(self.origin, fields));
    },
    get context() {
      // @ts-expect-error type of getParent
      const context = getParent(self).context.current;
      return {
        ...self.mock_context.current,
        ...context,
      };
    },
    get payloadForSQL(): TPayloadForSQL {
      // @ts-expect-error type of getParent
      const global_sql_snippets = getParent(self).globalSQLSnippets;

      const params = {
        context: this.context,
        filters: self.filters.valuesForPayload,
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
        filters: self.filters.valuesForPayload,
      } as TPayloadForViz;
    },
    get dashboardStateValues() {
      return payloadToDashboardStateValues(this.payloadForSQL);
    },
    getAdditionalQueryInfo(query_id: string): TAdditionalQueryInfo {
      return { content_id: self.id, query_id, params: this.dashboardStateValues };
    },
    get changed() {
      return (
        this.filtersChanged ||
        this.queriesChanged ||
        this.sqlSnippetsChanged ||
        this.viewsChanged ||
        this.panelsChanged ||
        this.layoutsChanged ||
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
    get filtersUsage() {
      const usages: FilterUsageType[] = [];
      const viewIDMap = self.views.idMap;
      self.filters.current.forEach((f) => {
        f.visibleInViewsIDs.forEach((vid) => {
          usages.push({
            filterID: f.id,
            type: 'view',
            type_label: 'view.label',
            id: vid,
            label: viewIDMap.get(vid)?.name ?? vid,
          });
        });
      });

      const fkidmap = self.filters.keyIDMap;
      self.queries.current.forEach((q) => {
        q.usedFilterKeySet.forEach((k) => {
          usages.push({
            filterID: fkidmap[k] ?? k,
            type: 'query',
            type_label: 'query.label',
            id: q.id,
            label: q.name,
          });
        });
      });

      self.sqlSnippets.usedFilterKeyMap.forEach((filterKeySet, snippetKey) => {
        filterKeySet.forEach((k) => {
          usages.push({
            filterID: fkidmap[k] ?? k,
            type: 'sql_snippet',
            type_label: 'sql_snippet.label',
            id: snippetKey,
            label: snippetKey,
          });
        });
      });

      return _.groupBy(usages, 'filterID');
    },
    findFilterUsage(filterID: string) {
      return this.filtersUsage[filterID] ?? [];
    },
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
          const label = p.name;
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
              type_label: 'panel.label',
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
        .forEach((f) => {
          usages.push({
            type: 'filter',
            type_label: 'filter.label',
            id: f.id,
            queryID: _.get(f, 'config.options_query_id'),
            label: f.label,
            views: f.visibleInViewsIDs.map((id) => ({
              id,
              label: viewIDMap.get(id)?.name ?? id,
            })),
          });
        });
      self.queries.current.forEach((q) => {
        if (!q.isTransform) {
          return;
        }
        const config = q.config as TransformQueryMetaInstance;
        config.dep_query_ids.forEach((queryID) => {
          usages.push({
            type: 'transform-query',
            type_label: 'query.transform.full_label',
            id: q.id,
            queryID,
            label: q.name,
            views: [],
          });
        });
      });

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
      self.queries.current.forEach((q) => {
        if (!q.typedAsSQL) {
          return;
        }
        const config = q.config as DBQueryMetaInstance;
        const keys = _.uniq(config.sql.match(UsageRegs.sqlSnippet));
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
    removeUnusedSQLSnippets() {
      const usedSQLSnippets = new Set(Object.keys(self.sqlSnippetsUsage));
      const keys = self.sqlSnippets.current.filter((s) => !usedSQLSnippets.has(s.key)).map((s) => s.key);
      self.sqlSnippets.removeByKeys(keys);
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
      self.layouts.removeByPanelID(panelID);
      self.views.findByID(viewID)?.removePanelID(panelID);
    },
    addANewPanel(viewID: string) {
      const id = uuidv4();
      self.panels.append(getNewPanel(id));
      self.views.findByID(viewID)?.appendPanelID(id);
      self.layouts.addALayoutItem(id);
    },
    applyJSONSchema(partialSchema: AnyObject) {
      const { views, panels, filters, definition = {}, layouts } = partialSchema;
      const { queries, sqlSnippets, mock_context } = definition;
      const panelIDMap: Map<string, string> = new Map(); // old -> new

      // PANELS
      if (Array.isArray(panels)) {
        const newPanels = panels.map((p) => {
          const newID = uuidv4();
          panelIDMap.set(p.id, newID);
          return {
            ...p,
            id: newID,
          };
        });
        self.panels.appendMultiple(newPanels);

        // import panels to current view
        if (!Array.isArray(views) || views.length === 0) {
          const panelIDs = newPanels.map((p) => p.id);
          self.views.VIE?.appendPanelIDs(panelIDs);
        }
      }

      // VIEWS
      if (Array.isArray(views)) {
        const newViews = views.map((v) => {
          const panelIDs = v.panelIDs.map((oldID: string) => panelIDMap.get(oldID) ?? oldID);
          return {
            ...v,
            id: uuidv4(),
            panelIDs,
          };
        });
        self.views.appendMultiple(newViews);
      }

      // LAYOUTS
      if (Array.isArray(layouts)) {
        const isBreakpointPresent = (name: string, breakpoint: number) => {
          const b = self.layouts.breakpointNameRecord[name];
          return b === breakpoint;
        };

        let basis: LayoutItem[] = [];
        const validLayoutSets = layouts.filter((l) => isBreakpointPresent(l.name, l.breakpoint));
        validLayoutSets.forEach((layoutSet) => {
          if (layoutSet.id === 'basis') {
            basis = layoutSet.list;
          }
          layoutSet.list.forEach((l: LayoutItem) => {
            const newPanelID = panelIDMap.get(l.panelID)!;
            l.id = uuidv4();
            l.panelID = newPanelID;
          });
        });

        self.layouts.list.forEach((layoutSet) => {
          const match = validLayoutSets.find((s) => s.name === layoutSet.name && s.breakpoint === layoutSet.breakpoint);
          if (!match) {
            basis!.forEach((basisLayoutItem: LayoutItem) => {
              layoutSet.addLayout(basisLayoutItem);
            });
            return;
          }

          match.list.forEach((matchedLayoutItem: LayoutItem) => {
            layoutSet.addLayout(matchedLayoutItem);
          });
        });
      }

      // FILTERS
      if (Array.isArray(filters)) {
        self.filters.appendMultiple(filters);
      }

      // QUERIES
      if (Array.isArray(queries)) {
        self.queries.appendMultiple(queries);
      }

      // SQL SNIPPETS
      if (Array.isArray(sqlSnippets)) {
        self.sqlSnippets.appendMultiple(sqlSnippets);
      }

      // MOCK_CONTEXT
      if (mock_context && Object.keys(mock_context).length > 0) {
        self.mock_context.defaults(mock_context);
      }
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
        applySnapshot(self.layouts.list, self.origin.layouts.list);
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

export function createContentModel(
  { id, name, dashboard_id, create_time, update_time, content }: DashboardContentDBType,
  context: ContextRecordType,
  filterValues: Record<string, any>,
) {
  if (!content) {
    throw new Error('unexpected null content when creating a content model');
  }

  const {
    version,
    filters,
    views,
    panels,
    layouts,
    definition: { queries, sqlSnippets, mock_context = {} },
  } = content;
  return ContentModel.create({
    id,
    name,
    dashboard_id,
    create_time,
    update_time,
    version,
    filters: getInitialFiltersConfig(filters, context, mock_context, filterValues),
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
    layouts: {
      list: layouts,
      currentBreakpoint: layouts[0].id,
    },
  });
}

export type ContentModelInstance = Instance<typeof ContentModel>;
