import { reaction, type IObservableArray } from 'mobx';
import { saveAs } from 'file-saver';
import { addDisposer, getParent, getRoot, Instance, types } from 'mobx-state-tree';
import {
  EViewComponentType,
  TabInfo,
  TabModelInstance,
  ViewMeta,
  ViewTabsConfigInstance,
  type ITabModel,
  type IViewMeta,
} from '~/model/meta-model';
// @ts-expect-error dom-to-image-more's declaration file
import domtoimage from 'dom-to-image-more';
import JSZip from 'jszip';
import { notifications } from '@mantine/notifications';
import _ from 'lodash';
import { typeAssert } from '~/types/utils';
import { ViewsRenderModel } from './views';

type ViewsRenderModelInstance = Instance<typeof ViewsRenderModel>;

export const ViewRenderModel = types
  .compose(
    'ViewRenderModel',
    ViewMeta,
    types.model({
      tab: types.optional(types.string, ''), // FIXME: manage this state in a better way
    }),
  )
  .views((self) => ({
    get tabs() {
      const config = self.config as ViewTabsConfigInstance;
      return config.tabs;
    },
    get tabInfo() {
      const tab = this.tabs.find((t) => t.id === self.tab);
      if (!tab) {
        return null;
      }
      return {
        id: tab.id,
        name: tab.name,
      };
    },
    get tabView() {
      if (self.type !== EViewComponentType.Tabs) {
        return null;
      }

      return this.tabs.find((t) => t.id === self.tab);
    },
    get tabViewID() {
      if (!this.tabView) {
        return '';
      }

      return this.tabView.view_id ?? '';
    },
    get contentModel() {
      // FIXME: type
      return getParent(self, 3) as any;
    },
    get panels() {
      if (self.type !== EViewComponentType.Tabs) {
        return this.contentModel.panels.panelsByIDs(self.panelIDs);
      }

      const viewID = this.tabViewID;
      const view = this.contentModel.views.findByID(viewID);
      return view?.panels ?? [];
    },
    get renderViewIDs() {
      const ret = [self.id];
      if (self.type === EViewComponentType.Tabs) {
        ret.push(this.tabViewID);
      }
      return ret;
    },
    async downloadScreenshot(dom: HTMLElement) {
      const width = dom.offsetWidth * 2 + 10; // padding-right of react-grid-layout
      const height = dom.offsetHeight * 2 + 10; // padding-bottom of react-grid-layout
      const zip = new JSZip();
      const t = new Date().getTime();

      const blob = await domtoimage.toBlob(dom, {
        bgcolor: 'white',
        width,
        height,
        style: { transformOrigin: '0 0', transform: 'scale(2)' },
      });
      zip.file(`${self.name}_${t}.png`, blob);
      zip.file(`dashboard_state_${t}.json`, JSON.stringify(this.contentModel.dashboardState, null, 4));

      zip
        .generateAsync({ type: 'blob' })
        .then((content) => {
          saveAs(content, `${self.name}_${t}.zip`);
        })
        .catch((err) => {
          console.error(err);
          notifications.show({
            color: 'red',
            title: 'Failed to download screenshot with dashboard state',
            message: err.message,
          });
        });
    },
  }))
  .actions((self) => ({
    setTab(tab: string | null) {
      self.tab = tab ?? '';
    },
    setTabByTabInfo(tabInfo: TabInfo) {
      self.tab = tabInfo.id ?? '';
    },
  }));

export type ViewRenderModelInstance = Instance<typeof ViewRenderModel>;

export interface IViewRenderModel extends IViewMeta {
  // Properties
  tab: string;

  // Views
  readonly tabs: IObservableArray<ITabModel>;
  readonly tabInfo: TabInfo | null;
  readonly tabView: ITabModel | null | undefined;
  readonly tabViewID: string;
  readonly contentModel: any; // todo: fix type
  readonly panels: IObservableArray<any>;
  readonly renderViewIDs: string[];

  // Methods
  setTab(tab: string | null): void;
  setTabByTabInfo(tabInfo: TabInfo): void;
  downloadScreenshot(dom: HTMLElement): Promise<void>;
}

typeAssert.shouldExtends<IViewRenderModel, Instance<typeof ViewRenderModel>>();
typeAssert.shouldExtends<Instance<typeof ViewRenderModel>, IViewRenderModel>();
