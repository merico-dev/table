import { Instance, types } from 'mobx-state-tree';

export const PanelStyleBorderModel = types
  .model('PanelStyleBorderModel', {
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

export type PanelStyleBorderModelInstance = Instance<typeof PanelStyleBorderModel>;
