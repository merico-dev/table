import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';

export const ViewConfigModel_Tabs = types
  .model('ViewModel_Tabs', {
    _name: types.literal(EViewComponentType.Modal),
    tabs: types.frozen(),
  })
  .views((self) => ({
    get json() {
      const { _name, tabs } = self;
      return {
        _name,
        tabs,
      };
    },
  }))
  .actions((self) => ({
    setTabs(v: any[]) {
      self.tabs = v;
    },
  }));

export type IViewConfigModel_Tabs = Instance<typeof ViewConfigModel_Tabs>;
export type IViewConfigModel_TabsIn = SnapshotIn<IViewConfigModel_Tabs>;

export const createViewConfig_Tabs = () =>
  ViewConfigModel_Tabs.create({
    _name: EViewComponentType.Modal,
    tabs: [],
  });
