import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { v4 as uuidv4 } from 'uuid';
import { shallowToJS } from '~/utils';
import { LayoutItemMeta } from './layout-item';

export const LayoutSetMeta = types
  .model('LayoutSetMeta', {
    id: types.identifier,
    breakpoint: types.number,
    list: types.optional(types.array(LayoutItemMeta), []),
  })
  .views((self) => ({
    get json() {
      const { id, breakpoint, list } = self;
      return {
        id,
        breakpoint,
        list: list.map((o) => shallowToJS(o.json)),
      };
    },
    findByID(id: string) {
      return self.list.find((l) => l.id === id);
    },
  }))
  .actions((self) => ({
    addLayout(panelID: string) {
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
  }));

export type LayoutSetMetaInstance = Instance<typeof LayoutSetMeta>;
export type LayoutSetMetaSnapshotIn = SnapshotIn<LayoutSetMetaInstance>;
export type LayoutSetMetaSnapshotOut = SnapshotOut<LayoutSetMetaInstance>;
