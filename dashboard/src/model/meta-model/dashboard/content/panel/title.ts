import { types } from 'mobx-state-tree';

export const PanelTitleMeta = types
  .model('PanelTitleMeta', {
    show: types.optional(types.boolean, true),
  })
  .views((self) => ({
    get json() {
      const { show } = self;
      return {
        show,
      };
    },
  }))
  .actions((self) => ({
    setShow(v: boolean) {
      self.show = v;
    },
  }));
