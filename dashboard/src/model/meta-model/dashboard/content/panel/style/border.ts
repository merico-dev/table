import { types } from 'mobx-state-tree';

export const PanelStyleBorderMeta = types
  .model('PanelStyleBorderMeta', {
    enabled: types.boolean,
  })
  .views((self) => ({
    get json() {
      const { enabled } = self;
      return {
        enabled,
      };
    },
  }))
  .actions((self) => ({
    setEnabled(v: boolean) {
      self.enabled = v;
    },
  }));
