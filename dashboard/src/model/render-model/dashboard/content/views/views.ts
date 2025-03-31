import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { type IObservableArray } from 'mobx';
import { IDashboardView } from '~/types';
import { TabsVariant } from '@mantine/core';

import {
  EViewComponentType,
  TabInfo,
  TabModelInstance,
  ViewMetaInstance,
  ViewRenderModel,
  type IViewRenderModel,
} from '~/model';
import { TabsOrientation, type IViewMeta } from '~/model/meta-model';
import { shallowToJS } from '~/utils';
import _ from 'lodash';
import { typeAssert } from '~/types/utils';

export const ViewsRenderModel = types
  .model('ViewsRenderModel', {
    current: types.optional(types.array(ViewRenderModel), []),
    visibleViewIDs: types.array(types.string),
  })
  .views((self) => ({
    get json() {
      return self.current.map((o) => shallowToJS(o.json));
    },
    get idMap() {
      const map = new Map<string, ViewMetaInstance>();
      self.current.forEach((v) => {
        map.set(v.id, v);
      });
      return map;
    },
    findByID(id: string) {
      return self.current.find((query) => query.id === id);
    },

    get firstVisibleView() {
      const [firstVisibleID] = self.visibleViewIDs;
      return self.current.find(({ id }) => id === firstVisibleID);
    },
    get visibleViews() {
      const idSet = new Set(self.visibleViewIDs);
      return self.current.filter(({ id }) => idSet.has(id));
    },
    get firstVisibleTabsView() {
      return this.visibleViews.find((v) => v.type === EViewComponentType.Tabs);
    },
    get firstVisibleTabsViewActiveTab() {
      const view = this.firstVisibleTabsView;
      if (!view) {
        return null;
      }
      return view.tabInfo;
    },
    get firstVisibleTabsViewActiveTabStr() {
      return JSON.stringify(this.firstVisibleTabsViewActiveTab);
    },
  }))
  .actions((self) => ({
    appendToVisibles(viewID: string) {
      const s = new Set(self.visibleViewIDs.map((v) => v));
      if (!s.has(viewID)) {
        self.visibleViewIDs.push(viewID);
      }
    },
    rmVisibleViewID(id: string) {
      const index = self.visibleViewIDs.findIndex((i) => i === id);
      if (index === -1) {
        return;
      }
      self.visibleViewIDs.splice(index, 1);
    },
    setFirstVisibleTabsViewActiveTab(tabInfo: TabInfo | null) {
      if (!tabInfo) {
        return;
      }
      const view = self.firstVisibleTabsView;
      view?.setTabByTabInfo(tabInfo);
    },
  }));

export type ViewsRenderModelInstance = Instance<typeof ViewsRenderModel>;

export interface IViewsRenderModel {
  // Properties
  current: IObservableArray<IViewRenderModel>;
  visibleViewIDs: IObservableArray<string>;

  // Views
  readonly json: Array<IViewRenderModel['json']>;
  readonly idMap: Map<string, IViewMeta>;
  readonly firstVisibleView: IViewRenderModel | undefined;
  readonly visibleViews: IViewRenderModel[];
  readonly firstVisibleTabsView: IViewRenderModel | undefined;
  readonly firstVisibleTabsViewActiveTab: TabInfo | null;
  readonly firstVisibleTabsViewActiveTabStr: string;

  // Methods
  findByID(id: string): IViewRenderModel | undefined;
  appendToVisibles(viewID: string): void;
  rmVisibleViewID(id: string): void;
  setFirstVisibleTabsViewActiveTab(tabInfo: TabInfo | null): void;
}

typeAssert.shouldExtends<IViewsRenderModel, Instance<typeof ViewsRenderModel>>();
typeAssert.shouldExtends<Instance<typeof ViewsRenderModel>, IViewsRenderModel>();

export function getInitialViewsRenderModel(
  views: IDashboardView[],
  activeTab: TabInfo | null,
): SnapshotIn<Instance<typeof ViewsRenderModel>> {
  const visibleViewIDs = views.length > 0 ? [views[0].id] : [];
  const processedViews = views.map((view) => {
    const { _name = view.type } = view.config;
    const processedView = {
      ...view,
      tab: '',
      config: {
        ...view.config,
        _name,
      },
      panelIDs: view.panelIDs,
    };

    if (view.type === EViewComponentType.Tabs) {
      let tab = _.minBy(view.config.tabs, (tab: TabModelInstance) => tab.order);
      if (!tab && view.config.tabs.length > 0) {
        tab = view.config.tabs[0];
      }
      processedView.tab = tab?.id ?? '';
    }

    return processedView;
  });
  if (activeTab) {
    processedViews[0].tab = activeTab.id;
  }
  return {
    current: processedViews,
    visibleViewIDs,
  };
}
