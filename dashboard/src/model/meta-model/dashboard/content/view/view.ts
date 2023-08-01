import { Instance, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';
import { createViewDivisionConfig, ViewDivisionConfig } from './widgets/division';
import { createViewModalConfig, ViewModalConfig } from './widgets/modal';
import { createViewTabsConfig, ViewTabsConfig } from './widgets/tabs';

export const ViewMeta = types
  .model({
    id: types.identifier,
    name: types.string,
    type: types.enumeration<EViewComponentType>('EViewComponentType', [
      EViewComponentType.Division,
      EViewComponentType.Modal,
      EViewComponentType.Tabs,
    ]),
    config: types.union(ViewDivisionConfig, ViewModalConfig, ViewTabsConfig),
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
          self.config = createViewDivisionConfig();
          break;
        case EViewComponentType.Modal:
          self.config = createViewModalConfig();
          break;
        case EViewComponentType.Tabs:
          self.config = createViewTabsConfig();
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
  }));

export type ViewMetaInstance = Instance<typeof ViewMeta>;
