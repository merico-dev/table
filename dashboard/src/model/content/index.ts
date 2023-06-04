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
import { AnyObject, DashboardContentDBType, TDashboardContent } from '../../types';
import { FiltersModel, getInitialFiltersPayload } from '../filters';
import { MockContextModel } from '../mock-context';
import { QueriesModel, QueryUsageType } from '../queries';
import { SQLSnippetsModel } from '../sql-snippets';

import { getNewPanel, PanelModelInstance, PanelsModel } from '../panels';
import { createDashboardViewsModel, ViewsModel } from '../views';

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
    mock_context: MockContextModel,
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
      return !isEqual(getSnapshot(get(self, fields)), get(self.origin, fields));
    },
    get panelsChanged() {
      const fields = 'panels.list';
      return !isEqual(getSnapshot(get(self, fields)), get(self.origin, fields));
    },
    get mockContextChanged() {
      const fields = 'mock_context.current';
      return !isEqual(get(self, fields), get(self.origin, fields));
    },
    get payloadForSQL() {
      // @ts-expect-error type of getParent
      const context = getParent(self).context.current;
      return {
        context,
        mock_context: self.mock_context.current,
        sqlSnippets: self.sqlSnippets.current,
        filterValues: self.filters.values,
      };
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
          dataProxy: null,
          len: 0,
          state: 'idle',
          error: undefined,
        };
      }
      return {
        data: q.data.toJSON(),
        dataProxy: q.data,
        len: q.data.length,
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
    findQueryUsage(queryID: string) {
      const panelIDMap = self.panels.idMap;
      const panels: QueryUsageType[] = self.views.current.flatMap((v) =>
        v.panelIDs
          .map((id) => panelIDMap.get(id))
          .filter((p): p is PanelModelInstance => p?.queryID === queryID)
          .map((p) => ({
            type: 'panel',
            id: p.id,
            label: p.title ? p.title : p.viz.type,
            views: [
              {
                id: v.id,
                label: v.name,
              },
            ],
          })),
      );

      const viewIDMap = self.views.idMap;
      const filters: QueryUsageType[] = self.filters.current
        .filter((f) => {
          const filterQueryID = _.get(f, 'config.options_query_id');
          return filterQueryID === queryID;
        })
        .map((f) => ({
          type: 'filter',
          id: f.id,
          label: f.label,
          views: f.visibleInViewsIDs.map((id) => ({
            id,
            label: viewIDMap.get(id)?.name ?? id,
          })),
        }));
      return panels.concat(filters);
    },
  }))
  .actions((self) => ({
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
        applySnapshot(self.views.current, createDashboardViewsModel(views).current);
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
    filters: getInitialFiltersPayload(filters),
    queries: {
      current: queries,
    },
    sqlSnippets: {
      current: sqlSnippets,
    },
    mock_context: {
      current: mock_context,
    },
    views: createDashboardViewsModel(views),
    panels: {
      list: panels,
    },
  });
}

export type ContentModelInstance = Instance<typeof ContentModel>;
