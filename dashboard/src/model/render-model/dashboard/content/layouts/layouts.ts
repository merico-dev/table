import { Instance, getRoot, types } from 'mobx-state-tree';
import { LayoutItemMetaInstance, LayoutSetMeta } from '~/model/meta-model';

export const LayoutsRenderModel = types
  .model('LayoutsRenderModel', {
    list: types.array(LayoutSetMeta),
  })
  .views((self) => ({
    get root() {
      return getRoot(self);
    },
    get contentModel() {
      // @ts-expect-error type of getRoot
      return this.root.content;
    },
    get json() {
      return self.list.map((o) => o.json);
    },
    get tempLayouts() {
      const layoutset = self.list[0];
      return layoutset.list;
    },
    get pureLayouts() {
      const layoutset = self.list[0];
      return layoutset.list.map((l) => l.layoutProperies);
    },
    findByPanelID(panelID: string) {
      const layout = self.list[0].findByID(panelID);
      return layout as LayoutItemMetaInstance;
    },
  }))
  .views((self) => ({}));

export type LayoutsRenderModelInstance = Instance<typeof LayoutsRenderModel>;
