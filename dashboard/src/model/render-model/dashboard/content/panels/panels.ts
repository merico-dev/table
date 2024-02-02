import { Instance, types } from 'mobx-state-tree';
import { PanelRenderModel, PanelRenderModelInstance } from './panel';

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
