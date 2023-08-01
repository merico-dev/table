import { Instance, types } from 'mobx-state-tree';
import { PanelStyleBorderMeta } from './border';

export const PanelStyleMeta = types
  .model('PanelStyleMeta', {
    border: PanelStyleBorderMeta,
  })
  .views((self) => ({
    get json() {
      const { border } = self;
      return {
        border: border.json,
      };
    },
  }))
  .actions((self) => ({}));
