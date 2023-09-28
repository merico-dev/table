import _ from 'lodash';
import { castToSnapshot, Instance, types } from 'mobx-state-tree';
import { NavOptionType } from '~/dashboard-editor/model/editor';
import { PanelsRenderModel } from '~/model';
import { PanelModel, PanelModelInstance, PanelModelSnapshotIn } from './panel';

export const PanelsModel = types
  .compose(
    'PanelsModel',
    PanelsRenderModel,
    types.model({
      list: types.optional(types.array(PanelModel), []),
    }),
  )
  .views((self) => ({
    editorOptions(viewID: string, panelIDs: string[]) {
      const { panels } = self.panelsByIDs(panelIDs);
      if (panels.length !== panelIDs.length) {
        console.warn(`Unfulfilled panels for View[${viewID}]`);
      }
      const ret = panels.map(
        (o) =>
          ({
            label: o.name,
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
  .actions((self) => ({
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
    removeByIDs(ids: string[]) {
      ids.forEach((id) => {
        this.removeByID(id);
      });
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
  }));

export type PanelsModelInstance = Instance<typeof PanelsModel>;
