import _ from 'lodash';
import { Instance } from 'mobx-state-tree';
import { Layout } from 'react-grid-layout';
import { v4 as uuidV4 } from 'uuid';
import { LayoutSetMetaSnapshotIn, LayoutsRenderModel } from '~/model';

export const LayoutsModel = LayoutsRenderModel.actions((self) => ({
  addALayoutSet() {
    const id = uuidV4();
    const target = self.basisLayoutSet;
    const newSet = target.json;
    newSet.id = id;
    newSet.name = id;
    newSet.breakpoint = target.breakpoint + 1000;
    newSet.list = newSet.list.map((l) => ({
      ...l,
      id: uuidV4(),
    }));
    self.list.push(newSet);
  },
  updateCurrentLayoutItems(allLayouts: Record<string, Layout[]>) {
    const items = allLayouts[self.currentBreakpoint];
    console.log(self.currentBreakpoint);
    self.currentLayoutSet.updateLayouts(items);
  },
  append(item: LayoutSetMetaSnapshotIn) {
    self.list.push(item);
  },
  appendMultiple(items: LayoutSetMetaSnapshotIn[]) {
    if (items.length === 0) {
      return;
    }

    self.list.push(...items);
  },
  remove(index: number) {
    self.list.splice(index, 1);
  },
  removeByID(id: string) {
    const index = self.list.findIndex((o) => o.id === id);
    if (index === -1) {
      return;
    }
    self.list.splice(index, 1);
  },
  removeByIDs(ids: string[]) {
    ids.forEach((id) => {
      this.removeByID(id);
    });
  },
}));

export type LayoutsModelInstance = Instance<typeof LayoutsModel>;
