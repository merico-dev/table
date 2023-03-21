import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType, IDashboardView } from '~/types';
import { ViewModel, ViewModelInstance } from './view';
import { IViewConfigModel_DivisionIn } from './view/division';
import { IViewConfigModel_ModalIn } from './view/modal';

export const ViewsModel = types
  .model('ViewsModel', {
    current: types.optional(types.array(ViewModel), []),
    visibleViewIDs: types.array(types.string),
    idOfVIE: types.string, // VIE: view in edit
  })
  .views((self) => ({
    get json() {
      return self.current.map((o) => o.json);
    },
    findByID(id: string) {
      return self.current.find((query) => query.id === id);
    },
    get isVIETheFirstView() {
      if (self.current.length === 0 || !self.idOfVIE) {
        return false;
      }
      return self.current[0].id === self.idOfVIE;
    },
    get firstVisibleView() {
      const [firstVisibleID] = self.visibleViewIDs;
      return self.current.find(({ id }) => id === firstVisibleID);
    },
    get visibleViews() {
      const idSet = new Set(self.visibleViewIDs);
      return self.current.filter(({ id }) => idSet.has(id));
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
      return self.current.map(
        (v) =>
          ({
            label: v.name,
            value: v.id,
            _type: 'view',
            // children: v.panels.editorOptions,
            // TODO
          } as const),
      );
    },
  }))
  .actions((self) => {
    return {
      replace(current: Array<ViewModelInstance>) {
        self.current.replace(current);
      },
      addANewView(
        id: string,
        name: string,
        type: EViewComponentType,
        config: IViewConfigModel_DivisionIn | IViewConfigModel_ModalIn,
      ) {
        self.current.push({
          id,
          name: name,
          type,
          config,
          panelIDs: [],
        });
      },
      append(item: ViewModelInstance) {
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
        self.current.splice(index, 1);
      },
      replaceByIndex(index: number, replacement: ViewModelInstance) {
        self.current.splice(index, 1, replacement);
      },
      setIDOfVIE(id: string) {
        self.idOfVIE = id;
        self.visibleViewIDs.length = 0;
        self.visibleViewIDs.push(id);
      },
      addAPanelToVIE() {
        // TODO
        // self.VIE?.panels.addANewPanel();
      },
      appendToVisibles(viewID: string) {
        const s = new Set(self.visibleViewIDs.map((v) => v));
        if (!s.has(viewID)) {
          self.visibleViewIDs.push(viewID);
        }
      },
    };
  })
  .actions((self) => ({
    addARandomNewView() {
      const id = new Date().getTime().toString();
      self.addANewView(id, EViewComponentType.Division, EViewComponentType.Division, {
        _name: EViewComponentType.Division,
      });
      self.setIDOfVIE(id);
    },
    removeVIE() {
      if (self.current.length === 1) {
        return;
      }
      self.removeByID(self.idOfVIE);
      self.setIDOfVIE(self.current[0].id);
    },
    rmVisibleViewID(id: string) {
      const index = self.visibleViewIDs.findIndex((i) => i === id);
      if (index === -1) {
        return;
      }
      self.visibleViewIDs.splice(index, 1);
    },
  }));

export type ViewsModelInstance = Instance<typeof ViewsModel>;
export * from './view';

export function createDashboardViewsModel(views: IDashboardView[]): SnapshotIn<Instance<typeof ViewsModel>> {
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
