import { types, Instance } from 'mobx-state-tree';
import { typeAssert } from '~/types/utils';

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

export interface IPanelStyleBorderMeta {
  enabled: boolean;
  json: {
    enabled: boolean;
  };

  setEnabled(v: boolean): void;
}

typeAssert.shouldExtends<IPanelStyleBorderMeta, Instance<typeof PanelStyleBorderMeta>>();
