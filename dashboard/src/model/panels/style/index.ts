import { Instance, types } from 'mobx-state-tree';
import { PanelStyleBorderModel } from './border';

export const PanelStyleModel = types
  .model('PanelStyleModel', {
    border: PanelStyleBorderModel,
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

export type PanelStyleModelInstance = Instance<typeof PanelStyleModel>;
