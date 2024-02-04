import { Instance, getRoot, types } from 'mobx-state-tree';
import { Layout } from 'react-grid-layout';

export const LayoutItemMeta = types
  .model('LayoutItemMeta', {
    id: types.identifier,
    panelID: types.string,
    x: types.number,
    y: types.maybeNull(types.number),
    w: types.number,
    h: types.number,
    moved: types.optional(types.boolean, false),
    static: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get json() {
      const { id, panelID, x, y, w, h, moved } = self;
      return {
        h,
        w,
        x,
        y: y === null ? 0 : y,
        id,
        moved,
        static: self.static,
        panelID,
      };
    },
    // FIXME: should move these to LayoutItemRenderModel & solve type errors
    get contentModel() {
      // @ts-expect-error typeof getRoot
      return getRoot(self).content;
    },
    get panel() {
      const { panelID } = self;
      return this.contentModel.panels.findByID(panelID);
    },
    get layoutProperies() {
      const { id, x, y, w, h, moved } = self;
      return { id, i: id, x, y, w, h, moved, static: self.static } as Layout;
    },
  }))
  .actions((self) => ({
    set(layout: Omit<Layout, 'i'>) {
      const { isDraggable, x, y, w, h, moved } = layout;
      self.x = x;
      self.y = y;
      self.w = w;
      self.h = h;
      self.moved = !!moved;
      self.static = !!layout.static;
    },
    setWidth(w: number) {
      self.w = w;
    },
    setHeight(h: number) {
      self.h = h;
    },
  }));

export type LayoutItemMetaInstance = Instance<typeof LayoutItemMeta>;
