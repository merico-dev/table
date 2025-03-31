import { Instance, types } from 'mobx-state-tree';
import { PanelRenderModel, PanelRenderModelInstance, type IPanelRenderModel } from './panel';
import { typeAssert } from '~/types/utils';
import type { IObservableArray } from 'mobx';

export const PanelsRenderModel = types
  .model('PanelsRenderModel', {
    list: types.optional(types.array(PanelRenderModel), []),
  })
  .views((self) => ({
    get json() {
      return self.list.map((o) => o.json);
    },
    findByID<T = PanelRenderModelInstance>(id: string) {
      return self.list.find((query) => query.id === id) as T | undefined;
    },
    get idMap() {
      const map = new Map<string, PanelRenderModelInstance>();
      self.list.forEach((p) => {
        map.set(p.id, p);
      });
      return map;
    },
  }))
  .views((self) => ({
    panelsByIDs(ids: string[]) {
      const panels: PanelRenderModelInstance[] = [];
      ids.forEach((id) => {
        const p = self.idMap.get(id);
        if (p) {
          panels.push(p);
        } else {
          console.warn(`Panel is not found, id:${id}`);
        }
      });
      return panels;
    },
  }));

export type PanelsRenderModelInstance = Instance<typeof PanelsRenderModel>;

export interface IPanelsRenderModel {
  list: IObservableArray<IPanelRenderModel>;
  readonly json: IPanelRenderModel['json'][];
  findByID<T = IPanelRenderModel>(id: string): T | undefined;
  readonly idMap: Map<string, IPanelRenderModel>;
  panelsByIDs(ids: string[]): IPanelRenderModel[];
}

typeAssert.shouldExtends<IPanelsRenderModel, Instance<typeof PanelsRenderModel>>();
typeAssert.shouldExtends<Instance<typeof PanelsRenderModel>, IPanelsRenderModel>();
