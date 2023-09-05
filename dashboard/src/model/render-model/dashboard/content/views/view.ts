import { reaction } from 'mobx';
import { addDisposer, getParent, Instance, types } from 'mobx-state-tree';
import { EViewComponentType, ViewMeta, ViewTabsConfigInstance } from '~/model/meta-model';

export const ViewRenderModel = types
  .compose(
    'ViewRenderModel',
    ViewMeta,
    types.model({
      tab: types.optional(types.string, ''), // FIXME: manage this state in a better way
    }),
  )
  .views((self) => ({
    get defaultTab() {
      if (self.type !== EViewComponentType.Tabs) {
        return '';
      }

      const config = self.config as ViewTabsConfigInstance;
      if (config.tabs.length > 0) {
        return config.tabs[0].id;
      }

      return '';
    },
    get tabViewID() {
      if (self.type !== EViewComponentType.Tabs) {
        return '';
      }

      const config = self.config as ViewTabsConfigInstance;
      return config.tabs.find((t) => t.id === self.tab)?.view_id ?? '';
    },
    get contentModel() {
      // FIXME: type
      return getParent(self, 3) as any;
    },
    get panels() {
      if (self.type !== EViewComponentType.Tabs) {
        return this.contentModel.panels.panelsByIDs(self.panelIDs).panels;
      }

      const viewID = this.tabViewID;
      const view = this.contentModel.views.findByID(viewID);
      return view.panels;
    },
    get renderViewIDs() {
      const ret = [self.id];
      if (self.type === EViewComponentType.Tabs) {
        ret.push(this.tabViewID);
      }
      return ret;
    },
  }))
  .actions((self) => ({
    setTab(tab: string | null) {
      self.tab = tab ?? '';
    },
    afterCreate() {
      addDisposer(
        self,
        reaction(
          () => self.defaultTab,
          (t) => this.setTab(t),
          {
            fireImmediately: true,
            delay: 0,
          },
        ),
      );
    },
  }));

export type ViewRenderModelInstance = Instance<typeof ViewRenderModel>;
