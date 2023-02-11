import { TabsOrientation, TabsVariant } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';

const TabModel = types
  .model('ViewModel_Tabs_Tab', {
    id: types.identifier,
    name: types.string,
    view_id: types.string,
  })
  .views((self) => ({
    get json() {
      const { id, name, view_id } = self;
      return {
        id,
        name,
        view_id,
      };
    },
  }))
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
    variant: types.optional(types.enumeration<TabsVariant>('variant', ['default', 'outline', 'pills']), 'default'),
    orientation: types.optional(
      types.enumeration<TabsOrientation>('orientation', ['horizontal', 'vertical']),
      'horizontal',
    ),
  })
  .views((self) => ({
    get json() {
      const { _name, variant, orientation, tabs } = self;
      return {
        _name,
        variant,
        orientation,
        tabs: tabs.map((t) => t.json),
      };
    },
  }))
  .actions((self) => ({
    setVariant(v: TabsVariant) {
      self.variant = v;
    },
    setOrientation(v: TabsOrientation) {
      self.orientation = v;
    },
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
