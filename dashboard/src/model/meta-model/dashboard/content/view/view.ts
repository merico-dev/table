import { Instance, types } from 'mobx-state-tree';
import { IObservableArray } from 'mobx';
import { EViewComponentType } from './types';
import { createViewDivisionConfig, ViewDivisionConfig, type IViewDivisionConfig } from './widgets/division';
import { createViewModalConfig, ViewModalConfig, type IViewModalConfig } from './widgets/modal';
import { createViewTabsConfig, ViewTabsConfig, type IViewTabsConfig } from './widgets/tabs';
import { typeAssert } from '~/types/utils';

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
        panelIDs: self.panelIDs.map((id) => id),
      };
    },
  }))
  .actions((self) => ({
    setName(name: string) {
      self.name = name;
    },
    setType(type: string | null) {
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
        default:
          return;
      }
      self.type = type;
    },
    appendPanelID(id: string) {
      self.panelIDs.push(id);
    },
    appendPanelIDs(ids: string[]) {
      self.panelIDs.push(...ids);
    },
    removePanelID(id: string) {
      const newIDs = self.panelIDs.filter((pid) => pid !== id);
      self.panelIDs.length = 0;
      self.panelIDs.push(...newIDs);
    },
  }));

export type ViewMetaInstance = Instance<typeof ViewMeta>;

export interface IViewMeta {
  // Properties
  id: string;
  name: string;
  type: EViewComponentType;
  config: IViewDivisionConfig | IViewModalConfig | IViewTabsConfig;
  panelIDs: IObservableArray<string>;

  // Views
  readonly json: {
    id: string;
    name: string;
    type: EViewComponentType;
    config: IViewDivisionConfig['json'] | IViewModalConfig['json'] | IViewTabsConfig['json'];
    panelIDs: string[];
  };

  // Methods
  setName(name: string): void;
  setType(type: EViewComponentType): void;
  appendPanelID(id: string): void;
  appendPanelIDs(ids: string[]): void;
  removePanelID(id: string): void;
}

typeAssert.shouldExtends<IViewMeta, Instance<typeof ViewMeta>>();
typeAssert.shouldExtends<Instance<typeof ViewMeta>, IViewMeta>();
