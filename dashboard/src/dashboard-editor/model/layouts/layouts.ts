import { Instance } from 'mobx-state-tree';
import { LayoutSetMetaSnapshotIn, LayoutsRenderModel } from '~/model';

export const LayoutsModel = LayoutsRenderModel.actions((self) => ({
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
