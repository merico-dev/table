import { Instance, types } from 'mobx-state-tree';

export const PanelLayoutModel = types
  .model('PanelLayoutModel', {
    x: types.number,
    y: types.number,
    w: types.number,
    h: types.number,
    moved: types.optional(types.boolean, false),
    static: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get json() {
      const { x, y, w, h, moved } = self;
      return {
        x,
        y,
        w,
        h,
        moved,
        static: self.static,
      };
    },
  }))
  .actions((self) => ({}));

export type PanelLayoutModelInstance = Instance<typeof PanelLayoutModel>;
