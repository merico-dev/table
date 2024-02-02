import { Instance, types } from 'mobx-state-tree';
import { LayoutSetMeta } from '~/model/meta-model';

export const LayoutsRenderModel = types
  .model('LayoutsRenderModel', {
    list: types.array(LayoutSetMeta),
  })
  .views((self) => ({
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
  }))
  .views((self) => ({}));

export type LayoutsRenderModelInstance = Instance<typeof LayoutsRenderModel>;
