import { Instance, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';
import { PanelsModel } from './panels';

export const ViewModel = types
  .model({
    id: types.string,
    type: types.string,
    config: types.frozen(),
    panels: PanelsModel,
  })
  .views((self) => ({
    get json() {
      const { id, type, config } = self;
      return {
        id,
        type,
        config,
        panels: self.panels.json,
      };
    },
  }))
  .actions((self) => ({
    setID(id: string) {
      self.id = id;
    },
    setType(type: EViewComponentType) {
      self.type = type;
    },
    setConfig(config: Record<string, any>) {
      self.config = config;
    },
  }))
  .actions((self) => ({}));

export type ViewModelInstance = Instance<typeof ViewModel>;
