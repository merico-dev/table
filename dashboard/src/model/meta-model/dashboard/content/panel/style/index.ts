import { types } from 'mobx-state-tree';
import { PanelStyleBorderMeta, type IPanelStyleBorderMeta } from './border';

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

export interface IPanelStyleMeta {
  border: IPanelStyleBorderMeta;
  json: {
    border: IPanelStyleBorderMeta['json'];
  };
}
