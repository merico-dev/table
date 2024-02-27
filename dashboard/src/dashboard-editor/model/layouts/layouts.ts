import _ from 'lodash';
import { Instance, types } from 'mobx-state-tree';
import { Layout } from 'react-grid-layout';
import { v4 as uuidV4 } from 'uuid';
import { LayoutSetInfo, LayoutSetMetaSnapshotIn, LayoutsRenderModel } from '~/model';

export const LayoutsModel = types
  .compose(
    'LayoutsModel',
    LayoutsRenderModel,
    types.model({
      currentLayoutWrapperWidth: types.optional(types.number, 0),
    }),
  )
  .views((self) => ({
    get divisionPreviewScale() {
      const w1 = self.currentLayoutPreviewWidth;
      const w2 = self.currentLayoutWrapperWidth;
      if (!w1 || !w2) {
        return 1;
      }
      if (w1 <= w2) {
        return 1;
      }

      return w2 / w1;
    },
  }))
  .actions((self) => ({
    addALayoutItem(panelID: string) {
      self.list.forEach((l) => {
        l.addNewLayout(panelID);
      });
    },
    duplicateLayoutItemsByPanelID(sourcePanelID: string, targetPanelID: string) {
      self.list.forEach((layoutSet) => {
        const match = layoutSet.findByPanelID(sourcePanelID);
        if (!match) {
          console.error(`Can't find a layout item by panelID[${sourcePanelID}] in layoutSet[${layoutSet.name}]`);
          return;
        }
        layoutSet.list.push({
          ...match,
          id: uuidV4(),
          panelID: targetPanelID,
          y: Infinity,
        });
      });
    },
    removeByPanelID(panelID: string) {
      self.list.forEach((layoutSet) => {
        layoutSet.removeByPanelID(panelID);
      });
    },
    setCurrentLayoutWrapperWidth(v: number) {
      self.currentLayoutWrapperWidth = v;
    },
    addALayoutSet(id: string, name: string, breakpoint: number) {
      const target = self.basisLayoutSet;
      const newSet = {
        id,
        name,
        breakpoint,
        list: target.json.list.map((l) => ({
          ...l,
          id: uuidV4(),
        })),
      };
      self.list.push(newSet);
    },
    updateLayoutSetsInfo(infos: LayoutSetInfo[]) {
      const idmap = _.keyBy(self.list, 'id');
      infos.forEach((info) => {
        const layoutset = idmap[info.id];
        if (layoutset) {
          layoutset.setName(info.name);
          layoutset.setBreakpoint(info.breakpoint);
          delete idmap[info.id];
          return;
        }

        this.addALayoutSet(info.id, info.name, info.breakpoint);
      });

      const idsToRemove = new Set(Object.keys(idmap));
      const willRemove = idsToRemove.size > 0;
      idsToRemove.forEach((id) => {
        const i = self.list.findIndex((s) => s.id === id);
        self.list.splice(i, 1);
      });
      if (willRemove) {
        self.setCurrentBreakpoint('basis');
      }
    },
    updateCurrentLayoutItem(item: Layout) {
      self.currentLayoutSet.updateLayoutItem(item);
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
