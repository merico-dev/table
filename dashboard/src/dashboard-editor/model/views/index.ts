import { getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType, ViewRenderModelInstance, ViewsRenderModel } from '~/model';
import { IDashboardView } from '~/types';
import { PanelsModelInstance } from '../panels';

import { ViewDivisionConfigSnapshotIn, ViewMetaInstance, ViewModalConfigSnapshotIn } from '~/model';
import { ViewModel, ViewModelInstance } from './view';
import { LayoutsModelInstance } from '../layouts';

export const ViewsModel = types
  .compose(
    'ViewsModel',
    ViewsRenderModel,
    types.model({
      current: types.optional(types.array(ViewModel), []),
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
      return self.current.find(({ id }) => id === self.idOfVIE) as ViewModelInstance;
    },
    get options() {
      return self.current.map((v) => ({
        label: v.name,
        value: v.id,
        type: v.type as EViewComponentType,
      }));
    },
    get tabViewOptions() {
      return this.options.filter((o) => o.type === EViewComponentType.Tabs);
    },
    tabOptions(viewID: string) {
      const view = self.current.find((v) => v.id === viewID && v.type === EViewComponentType.Tabs && v.tabs.length > 0);
      if (!view) {
        return [];
      }
      return view.tabs.map((t) => ({
        label: t.name,
        value: t.id,
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
    get contentModel() {
      // @ts-expect-error getRoot type, reading panels
      return getRoot(self).content;
    },
  }))
  .actions((self) => ({
    setIDOfVIE(id: string) {
      self.idOfVIE = id;
      self.visibleViewIDs.length = 0;
      self.visibleViewIDs.push(id);
    },
    resetIDOfVIE() {
      this.setIDOfVIE(self.current[0].id);
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
    appendMultiple(items: ViewRenderModelInstance[]) {
      if (items.length === 0) {
        return;
      }

      self.current.push(...items);
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
      const panels: PanelsModelInstance = self.contentModel.panels;
      const layouts: LayoutsModelInstance = self.contentModel.layouts;

      panels.removeByIDs(view.panelIDs);
      layouts.removeByPanelIDs(view.panelIDs);
      self.current.splice(index, 1);
      this.resetIDOfVIE();
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
      this.resetIDOfVIE();
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
