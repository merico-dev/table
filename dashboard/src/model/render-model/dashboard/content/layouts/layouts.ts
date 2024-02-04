import { Instance, getRoot, types } from 'mobx-state-tree';
import { Layout } from 'react-grid-layout';
import { LayoutItemMetaInstance, LayoutSetMeta } from '~/model/meta-model';

export const LayoutsRenderModel = types
  .model('LayoutsRenderModel', {
    list: types.array(LayoutSetMeta),
  })
  .views((self) => ({
    get json() {
      return self.list.map((o) => o.json);
    },
    get root() {
      return getRoot(self);
    },
    get contentModel() {
      // @ts-expect-error type of getRoot
      return this.root.content;
    },
    get cols() {
      const ret: Record<string, 36> = {};
      self.list.forEach((set) => {
        ret[set.id] = 36;
      });
      return ret;
    },
    get breakpoints() {
      const ret: Record<string, number> = {};
      self.list.forEach((set) => {
        ret[set.id] = set.breakpoint;
      });
      return ret;
    },
    items(panelIDs: string[]) {
      const panelIDSet = new Set(panelIDs);
      const layoutset = self.list[0];
      return layoutset.list.filter((l) => panelIDSet.has(l.panelID));
    },
    gridLayouts(panelIDs: string[]) {
      const panelIDSet = new Set(panelIDs);
      const ret: Record<string, Layout[]> = {};
      self.list.forEach((set) => {
        ret[set.id] = set.list.filter((l) => panelIDSet.has(l.panelID)).map((l) => l.layoutProperies);
      });
      return ret;
    },
    findByPanelID(panelID: string) {
      const layout = self.list[0].findByID(panelID);
      return layout as LayoutItemMetaInstance;
    },
  }))
  .views((self) => ({}));

export type LayoutsRenderModelInstance = Instance<typeof LayoutsRenderModel>;
