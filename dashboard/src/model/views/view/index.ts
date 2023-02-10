import { Instance, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';
import { ViewConfigModel_Division, createViewConfig_Division } from './division';
import { ViewConfigModel_Modal, createViewConfig_Modal } from './modal';
import { PanelsModel } from './panels';
import { createViewConfig_Tabs, ViewConfigModel_Tabs } from './tabs';

export const ViewModel = types
  .model({
    id: types.identifier,
    name: types.string,
    type: types.enumeration<EViewComponentType>('EViewComponentType', [
      EViewComponentType.Division,
      EViewComponentType.Modal,
      EViewComponentType.Tabs,
    ]),
    config: types.union(ViewConfigModel_Division, ViewConfigModel_Modal, ViewConfigModel_Tabs),
    panels: PanelsModel,
  })
  .views((self) => ({
    get json() {
      const { id, name, type, config } = self;
      return {
        id,
        name,
        type,
        config: config.json,
        panels: self.panels.json,
      };
    },
  }))
  .actions((self) => ({
    setName(name: string) {
      self.name = name;
    },
    setType(type: EViewComponentType) {
      if (self.type === type) {
        return;
      }
      switch (type) {
        case EViewComponentType.Division:
          self.config = createViewConfig_Division();
          break;
        case EViewComponentType.Modal:
          self.config = createViewConfig_Modal();
          break;
        case EViewComponentType.Tabs:
          self.config = createViewConfig_Tabs();
          break;
      }
      self.type = type;
    },
  }))
  .actions((self) => ({}));

export type ViewModelInstance = Instance<typeof ViewModel>;
