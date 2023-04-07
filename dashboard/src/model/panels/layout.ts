import { Instance, types } from 'mobx-state-tree';
import { Layout } from 'react-grid-layout';

export const PanelLayoutModel = types
  .model('PanelLayoutModel', {
    x: types.number,
    y: types.maybeNull(types.number), // https://github.com/merico-dev/table/issues/814
    w: types.number,
    h: types.number,
    moved: types.optional(types.boolean, false),
    static: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get json() {
      const { x, y, w, h, moved } = self;
      return {
        h,
        w,
        x,
        y: y === null ? 0 : y,
        moved,
        static: self.static,
      };
    },
  }))
  .actions((self) => ({
    set(layout: Omit<Layout, 'i'>) {
      const { x, y, w, h, moved } = layout;
      self.x = x;
      self.y = y;
      self.w = w;
      self.h = h;
      self.moved = !!moved;
      self.static = !!layout.static;
    },
  }));

export type PanelLayoutModelInstance = Instance<typeof PanelLayoutModel>;
