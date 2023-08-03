import { TabsOrientation, TabsVariant } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType } from '../types';

const TabModel = types
  .model('ViewTabsTabModel', {
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

export type TabModelInstance = Instance<typeof TabModel>;
type TabModelSnapshotIn = SnapshotIn<TabModelInstance>;

export const ViewTabsConfig = types
  .model('ViewTabsConfig', {
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

export type ViewTabsConfigInstance = Instance<typeof ViewTabsConfig>;
export type ViewTabsConfigSnapshotIn = SnapshotIn<ViewTabsConfigInstance>;

export const createViewTabsConfig = () =>
  ViewTabsConfig.create({
    _name: EViewComponentType.Modal,
    tabs: [],
  });
