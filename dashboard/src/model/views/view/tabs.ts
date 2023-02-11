import { randomId } from '@mantine/hooks';
import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';

const TabModel = types
  .model('ViewModel_Tabs_Tab', {
    id: types.identifier,
    name: types.string,
    view_id: types.string,
  })
  .actions((self) => ({
    setName(v: string) {
      self.name = v;
    },
    setViewID(v: string) {
      self.view_id = v;
    },
  }));

type TabModelInstance = Instance<typeof TabModel>;
type TabModelSnapshotIn = SnapshotIn<TabModelInstance>;

export const ViewConfigModel_Tabs = types
  .model('ViewModel_Tabs', {
    _name: types.literal(EViewComponentType.Modal),
    tabs: types.optional(types.array(TabModel), []),
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
    setTabs(v: TabModelSnapshotIn[]) {
      self.tabs.length = 0;
      self.tabs = cast(v);
    },
    addTab() {
      const id = randomId();
      const v = {
        id,
        name: id,
        view_id: '',
      };
      self.tabs.push(v);
    },
    removeTab(index: number) {
      self.tabs.splice(index, 1);
    },
  }));

export type IViewConfigModel_Tabs = Instance<typeof ViewConfigModel_Tabs>;
export type IViewConfigModel_TabsIn = SnapshotIn<IViewConfigModel_Tabs>;

export const createViewConfig_Tabs = () =>
  ViewConfigModel_Tabs.create({
    _name: EViewComponentType.Modal,
    tabs: [],
  });
