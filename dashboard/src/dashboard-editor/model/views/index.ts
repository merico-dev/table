import { getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType, ViewRenderModelInstance, ViewsRenderModel } from '~/model';
import { IDashboardView } from '~/types';
import { PanelsModelInstance } from '../panels';

import { ViewDivisionConfigSnapshotIn, ViewMetaInstance, ViewModalConfigSnapshotIn } from '~/model';

export const ViewsModel = types
  .compose(
    'ViewsModel',
    ViewsRenderModel,
    types.model({
      idOfVIE: types.string, // VIE: view in edit
    }),
  )
  .views((self) => ({
    get isVIETheFirstView() {
      if (self.current.length === 0 || !self.idOfVIE) {
        return false;
      }
      return self.current[0].id === self.idOfVIE;
    },
    get VIE() {
      return self.current.find(({ id }) => id === self.idOfVIE);
    },
    get options() {
      return self.current.map((v) => ({
        label: v.name,
        value: v.id,
        type: v.type as EViewComponentType,
      }));
    },
    get editorOptions() {
      // @ts-expect-error getRoot type, reading panels
      const panels: PanelsModelInstance = getRoot(self).content.panels;
      return self.current.map(
        (v) =>
          ({
            label: v.name,
            value: v.id,
            _type: 'view',
            children: panels.editorOptions(v.id, v.panelIDs),
          } as const),
      );
    },
  }))
  .actions((self) => ({
    setIDOfVIE(id: string) {
      self.idOfVIE = id;
      self.visibleViewIDs.length = 0;
      self.visibleViewIDs.push(id);
    },
    replace(current: Array<ViewRenderModelInstance>) {
      self.current.replace(current);
    },
    addANewView(
      id: string,
      name: string,
      type: EViewComponentType,
      config: ViewDivisionConfigSnapshotIn | ViewModalConfigSnapshotIn,
    ) {
      self.current.push({
        id,
        name: name,
        type,
        config,
        panelIDs: [],
      });
    },
    append(item: ViewRenderModelInstance) {
      self.current.push(item);
    },
    remove(index: number) {
      self.current.splice(index, 1);
    },
    removeByID(id: string) {
      const index = self.current.findIndex((o) => o.id === id);
      if (index === -1) {
        return;
      }
      const view = self.current[index];
      // @ts-expect-error getRoot type, reading panels
      const panels: PanelsModelInstance = getRoot(self).content.panels;

      panels.removeByIDs(view.panelIDs);
      self.current.splice(index, 1);
    },
    replaceByIndex(index: number, replacement: ViewRenderModelInstance) {
      self.current.splice(index, 1, replacement);
    },
    addARandomNewView() {
      const id = new Date().getTime().toString();
      this.addANewView(id, EViewComponentType.Division, EViewComponentType.Division, {
        _name: EViewComponentType.Division,
      });
      this.setIDOfVIE(id);
    },
    removeVIE() {
      if (self.current.length === 1) {
        return;
      }
      this.removeByID(self.idOfVIE);
      this.setIDOfVIE(self.current[0].id);
    },
  }));

export type ViewsModelInstance = Instance<typeof ViewsModel>;

export function getInitialDashboardViewsModel(views: IDashboardView[]): SnapshotIn<Instance<typeof ViewsModel>> {
  const visibleViewIDs = views.length > 0 ? [views[0].id] : [];
  const idOfVIE = views.length > 0 ? views[0].id : '';
  const processedViews = views.map((view) => {
    const { _name = view.type } = view.config;
    return {
      ...view,
      config: {
        ...view.config,
        _name,
      },
      panelIDs: view.panelIDs,
    };
  });
  return {
    current: processedViews,
    visibleViewIDs,
    idOfVIE,
  };
}
