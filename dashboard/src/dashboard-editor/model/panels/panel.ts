import { getParent, getParentOfType, getRoot, Instance, SnapshotIn } from 'mobx-state-tree';
import { TableVizComponent } from '~/components/plugins/viz-components/table';
import { ContentModel } from '~/dashboard-editor/model';
import { PanelMeta } from '~/model/meta-model/dashboard/content/panel';
import { QueryModelInstance } from '../queries';

export const PanelModel = PanelMeta.views((self) => ({
  // FIXME: 'contentModel' implicitly has return type 'any' because it does not have a return type annotation and is referenced directly or indirectly in one of its return expressions.ts(7023)
  get contentModel(): any {
    return getParentOfType(self, ContentModel);
  },
}))
  .views((self) => ({
    get queries(): QueryModelInstance[] {
      return self.contentModel.queries.findByIDSet(self.queryIDSet);
    },
    get data() {
      return this.queries.reduce((ret: TPanelData, q) => {
        ret[q.id] = q.data.toJSON();
        return ret;
      }, {});
    },
    get dataLoading() {
      return this.queries.some((q) => q.state === 'loading');
    },
    get queryStateMessages() {
      return this.queries.map((q) => q.stateMessage).filter((m) => !!m);
    },
    get queryErrors() {
      return this.queries.map((q) => q.error).filter((e) => !!e);
    },
    get canRenderViz() {
      return this.queryErrors.length === 0 && this.queryStateMessages.length === 0 && !this.dataLoading;
    },
    get dataFieldOptions() {
      if (self.queryIDs.length === 0) {
        return [];
      }

      return this.queries
        .map((query) => {
          const queryData = query.data;
          if (queryData.length === 0) {
            return [];
          }
          const keys = Object.keys(queryData[0]);
          return keys.map((k) => ({
            label: k,
            value: `${query.id}.${k}`,
            group: query.name,
          }));
        })
        .flat();
    },
  }))
  .actions((self) => ({
    removeSelf() {
      const parent = getParent(self, 2) as any;
      parent.removeByID(self.id);
    },
  }))
  .actions((self) => ({
    moveToView(sourceViewID: string, targetViewID: string) {
      // @ts-expect-error getRoot type
      const sourceView = getRoot(self).content.views.findByID(sourceViewID);
      sourceView.removePanelID(self.id);

      // @ts-expect-error getRoot type
      const targetView = getRoot(self).content.views.findByID(targetViewID);
      targetView.appendPanelID(self.id);

      // @ts-expect-error getRoot type
      const editor = getRoot(self).editor;
      editor.setPath(['_VIEWS_', targetViewID, '_PANELS_', self.id]);
    },
    refreshData() {
      self.queries.forEach((q) => q.fetchData());
    },
    downloadData() {
      // @ts-expect-error typeof getRoot
      getRoot(self).content.queries.downloadDataByQueryIDs(self.queryIDs);
    },
  }));

export type PanelModelInstance = Instance<typeof PanelModel>;
export type PanelModelSnapshotIn = SnapshotIn<PanelModelInstance>;

export function getNewPanel(id: string): PanelModelSnapshotIn {
  return {
    id,
    layout: {
      x: 0,
      y: Infinity, // puts it at the bottom
      w: 18,
      h: 300,
    },
    title: id,
    description: '<p></p>',
    queryIDs: [],
    viz: {
      type: TableVizComponent.name,
      conf: TableVizComponent.createConfig(),
    },
    style: {
      border: {
        enabled: true,
      },
    },
  };
}
