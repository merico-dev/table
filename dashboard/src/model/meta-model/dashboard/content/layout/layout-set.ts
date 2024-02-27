import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { v4 as uuidv4 } from 'uuid';
import { shallowToJS } from '~/utils';
import { LayoutItem, LayoutItemMeta } from './layout-item';
import { Layout } from 'react-grid-layout';
import _ from 'lodash';

export type LayoutSetInfo = { id: string; name: string; breakpoint: number };

export const LayoutSetMeta = types
  .model('LayoutSetMeta', {
    id: types.identifier,
    name: types.string,
    breakpoint: types.number,
    list: types.optional(types.array(LayoutItemMeta), []),
  })
  .views((self) => ({
    get json() {
      const { id, name, breakpoint, list } = self;
      return {
        id,
        name,
        breakpoint,
        list: list.map((o) => shallowToJS(o.json)),
      };
    },
    jsonByPanelIDSet(panelIDSet: Set<string>) {
      const { id, name, breakpoint, list } = self;
      return {
        id,
        name,
        breakpoint,
        list: list.filter((o) => panelIDSet.has(o.panelID)).map((o) => shallowToJS(o.json)),
      };
    },
    findByID(id: string) {
      return self.list.find((l) => l.id === id);
    },
    findByPanelID(panelID: string) {
      return self.list.find((l) => l.panelID === panelID);
    },
  }))
  .actions((self) => ({
    setName(v: string) {
      self.name = v;
    },
    setBreakpoint(v: number) {
      self.breakpoint = v;
    },
    addLayout(layoutItem: LayoutItem) {
      self.list.push(layoutItem);
    },
    addNewLayout(panelID: string) {
      self.list.push({
        id: uuidv4(),
        panelID,
        x: 0,
        y: Infinity, // puts it at the bottom
        w: 18,
        h: 300,
        static: false,
        moved: false,
      });
    },
    removeByPanelID(panelID: string) {
      const i = self.list.findIndex((l) => l.panelID === panelID);
      if (i >= 0) {
        self.list.splice(i, 1);
      }
    },
    updateLayoutItem(item: Layout) {
      const layoutItem = self.list.find((o) => o.id === item.i);
      if (!layoutItem) {
        console.error("Trying to update a layout that doesn't exist");
        console.log({ strangeLayoutItem: item });
        return;
      }
      layoutItem.set(item);
    },
  }));

export type LayoutSetMetaInstance = Instance<typeof LayoutSetMeta>;
export type LayoutSetMetaSnapshotIn = SnapshotIn<LayoutSetMetaInstance>;
export type LayoutSetMetaSnapshotOut = SnapshotOut<LayoutSetMetaInstance>;
