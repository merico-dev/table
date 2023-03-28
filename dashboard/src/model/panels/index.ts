import { randomId } from '@mantine/hooks';
import _ from 'lodash';
import { castToSnapshot, Instance, types } from 'mobx-state-tree';
import { NavOptionType } from '~/model/editor';
import { PanelModel, PanelModelInstance, PanelModelSnapshotIn } from './panel';

export const PanelsModel = types
  .model('PanelsModel', {
    list: types.optional(types.array(PanelModel), []),
  })
  .views((self) => ({
    get json() {
      return self.list.map((o) => o.json);
    },
    findByID(id: string) {
      return self.list.find((query) => query.id === id);
    },
    get idMap() {
      const map = new Map<string, PanelModelInstance>();
      self.list.forEach((p) => {
        map.set(p.id, p);
      });
      return map;
    },
  }))
  .views((self) => ({
    panelsByIDs(ids: string[]) {
      const panels: PanelModelInstance[] = [];
      ids.forEach((id) => {
        const p = self.idMap.get(id);
        if (p) {
          panels.push(p);
        } else {
          console.warn(`Panel is not found, id:${id}`);
        }
      });

      const layouts = panels.map((o) => ({
        ...o.layout.json,
        i: o.id,
      }));
      return { panels, layouts };
    },
  }))
  .views((self) => ({
    editorOptions(viewID: string, panelIDs: string[]) {
      const { panels } = self.panelsByIDs(panelIDs);
      if (panels.length !== panelIDs.length) {
        console.warn(`Unfulfilled panels for View[${viewID}]`);
      }
      const ret = panels.map(
        (o) =>
          ({
            label: o.title ? o.title : _.capitalize(o.viz.type),
            value: o.id,
            _type: 'panel',
            parentID: viewID,
          } as NavOptionType),
      );
      const _action_type = '_Add_A_PANEL_';
      ret.push({
        label: _action_type,
        value: _action_type,
        _type: 'ACTION',
        _action_type,
        parentID: viewID,
        Icon: null,
        children: null,
      } as const);
      return ret;
    },
  }))
  .actions((self) => {
    return {
      replace(current: Array<PanelModelInstance>) {
        self.list = castToSnapshot(current);
      },
      append(item: PanelModelSnapshotIn) {
        self.list.push(item);
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
      duplicateByID(id: string) {
        const base = self.list.find((o) => o.id === id);
        if (!base) {
          console.error(new Error(`[duplicate panel] Can't find a panel by id[${id}]`));
          return;
        }
        const newID = new Date().getTime().toString();
        self.list.push({
          ...base.json,
          id: newID,
          layout: {
            ...base.layout,
            y: Infinity,
            moved: false,
          },
        });
        return newID;
      },
      replaceByIndex(index: number, replacement: PanelModelInstance) {
        self.list.splice(index, 1, replacement);
      },
    };
  });

export type PanelsModelInstance = Instance<typeof PanelsModel>;
export * from './panel';
