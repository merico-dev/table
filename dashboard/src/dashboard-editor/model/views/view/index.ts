import { Instance, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';
import { createViewConfig_Division, ViewConfigModel_Division } from './division';
import { createViewConfig_Modal, ViewConfigModel_Modal } from './modal';
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
    panelIDs: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get json() {
      const { id, name, type, config } = self;
      return {
        id,
        name,
        type,
        config: config.json,
        panelIDs: self.panelIDs,
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
    appendPanelID(id: string) {
      self.panelIDs.push(id);
    },
    removePanelID(id: string) {
      const newIDs = self.panelIDs.filter((pid) => pid !== id);
      self.panelIDs.length = 0;
      self.panelIDs.push(...newIDs);
    },
  }))
  .actions((self) => ({}));

export type ViewModelInstance = Instance<typeof ViewModel>;
