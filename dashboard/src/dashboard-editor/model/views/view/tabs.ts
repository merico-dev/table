import { TabsOrientation, TabsVariant } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';

const TabModel = types
  .model('ViewModel_Tabs_Tab', {
    id: types.identifier,
    name: types.string,
    view_id: types.string,
    color: types.optional(types.string, ''),
  })
  .views((self) => ({
    get json() {
      const { id, name, view_id, color } = self;
      return {
        id,
        name,
        color,
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
    setColor(v: string) {
      self.color = v;
    },
  }));

type TabModelInstance = Instance<typeof TabModel>;
export type ViewConfigModel_Tabs_Tab_Instance = TabModelInstance;
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
    grow: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get json() {
      const { _name, variant, orientation, tabs, grow } = self;
      return {
        grow,
        tabs: tabs.map((t) => t.json),
        _name,
        variant,
        orientation,
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
    setGrow(v: boolean) {
      self.grow = v;
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