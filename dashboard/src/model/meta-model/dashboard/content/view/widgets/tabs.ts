import { TabsVariant } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType } from '../types';
import _ from 'lodash';
import { typeAssert } from '~/types/utils';
import type { IObservableArray } from 'mobx';

export type TabInfo = { id: string; name: string };
export type TabsOrientation = 'vertical' | 'horizontal';

const TabModel = types
  .model('ViewTabsTabModel', {
    id: types.identifier,
    name: types.string,
    view_id: types.string,
    color: types.optional(types.string, ''),
    order: types.optional(types.number, 0),
  })
  .views((self) => ({
    get json() {
      const { id, name, view_id, color, order } = self;
      return {
        id,
        name,
        color,
        order,
        view_id,
      };
    },
  }))
  .actions((self) => ({
    setName(v: string) {
      self.name = v;
    },
    setViewID(v: string | null) {
      if (!v) {
        return;
      }

      self.view_id = v;
    },
    setColor(v: string) {
      self.color = v;
    },
    setOrder(v: string | number) {
      if (typeof v === 'string') {
        return;
      }
      self.order = v;
    },
  }));

export type TabModelInstance = Instance<typeof TabModel>;
type TabModelSnapshotIn = SnapshotIn<TabModelInstance>;

export interface ITabModel {
  id: string;
  name: string;
  view_id: string;
  color: string;
  order: number;
  readonly json: { id: string; name: string; color: string; order: number; view_id: string };
  setName(v: string): void;
  setViewID(v: string | null): void;
  setColor(v: string): void;
  setOrder(v: string | number): void;
}

typeAssert.shouldExtends<ITabModel, Instance<typeof TabModel>>();
typeAssert.shouldExtends<Instance<typeof TabModel>, ITabModel>();

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
    get tabsInOrder() {
      return _.sortBy(self.tabs, 'order');
    },
  }))
  .actions((self) => ({
    setVariant(v: string | null) {
      if (!v) {
        return;
      }
      self.variant = v as TabsVariant;
    },
    setOrientation(v: string | null) {
      if (!v) {
        return;
      }
      self.orientation = v as TabsOrientation;
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

export interface IViewTabsConfig {
  // Properties
  _name: EViewComponentType.Modal;
  tabs: IObservableArray<ITabModel>;
  variant: TabsVariant;
  orientation: TabsOrientation;
  grow: boolean;

  // Views
  readonly json: {
    _name: EViewComponentType.Modal;
    tabs: Array<ITabModel['json']>;
    variant: TabsVariant;
    orientation: TabsOrientation;
    grow: boolean;
  };
  readonly tabsInOrder: ITabModel[];

  // Methods
  setVariant(v: string | null): void;
  setOrientation(v: string | null): void;
  setGrow(v: boolean): void;
  setTabs(
    v: Array<{
      id: string;
      name: string;
      view_id: string;
      color?: string;
      order?: number;
    }>,
  ): void;
  addTab(): void;
  removeTab(index: number): void;
}

typeAssert.shouldExtends<IViewTabsConfig, Instance<typeof ViewTabsConfig>>();
typeAssert.shouldExtends<Instance<typeof ViewTabsConfig>, IViewTabsConfig>();

export const createViewTabsConfig = () =>
  ViewTabsConfig.create({
    _name: EViewComponentType.Modal,
    tabs: [],
  });
