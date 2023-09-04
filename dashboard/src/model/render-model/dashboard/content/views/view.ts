import { reaction } from 'mobx';
import { addDisposer, flow, getParent, Instance, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
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
    get panels() {
      // FIXME: type
      const contentModel = getParent(self, 3) as any;
      const directPanels = contentModel.panels.panelsByIDs(self.panelIDs);
      if (self.type !== EViewComponentType.Tabs) {
        return directPanels;
      }
      return directPanels.concat([]);
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
