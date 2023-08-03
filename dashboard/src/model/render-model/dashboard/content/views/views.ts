import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { IDashboardView } from '~/types';

import { ViewMeta, ViewMetaInstance } from '~/model';
import { shallowToJS } from '~/utils/shallow-to-js';

export const ViewsRenderModel = types
  .model('ViewsRenderModel', {
    current: types.optional(types.array(ViewMeta), []),
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
  }));

export type ViewsRenderModelInstance = Instance<typeof ViewsRenderModel>;

export function getInitialViewsRenderModel(views: IDashboardView[]): SnapshotIn<Instance<typeof ViewsRenderModel>> {
  const visibleViewIDs = views.length > 0 ? [views[0].id] : [];
  const processedViews = views.map((view) => {
    const { _name = view.type } = view.config;
    return {
      ...view,
      config: {
        ...view.config,
        _name,
      },
      panelIDs: view.panelIDs,
    };
  });
  return {
    current: processedViews,
    visibleViewIDs,
  };
}
