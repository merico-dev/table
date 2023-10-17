import _ from 'lodash';
import { Instance, SnapshotIn } from 'mobx-state-tree';
import { EViewComponentType, ViewRenderModel } from '~/model';
import { AnyObject } from '~/types';
import { downloadJSON } from '~/utils/download';

export const ViewModel = ViewRenderModel.actions((self) => ({
  getSchema() {
    const view = self.json;
    const panels: AnyObject[] = [];
    const queries: AnyObject[] = [];
    self.panels.forEach((p: any) => {
      const ps = p.getSchema();
      panels.push(ps.panel);
      if (ps.queries.length > 0) {
        queries.push(...ps.queries);
      }
    });

    const ret = {
      views: [view],
      panels: panels,
      definition: {
        queries: _.uniqBy(queries, (q) => q.id),
      },
    };
    return ret;
  },
  downloadSchema() {
    if (self.type === EViewComponentType.Tabs) {
      console.error(new Error('Please choose a tab first'));
      return;
    }
    const schema = JSON.stringify(this.getSchema(), null, 2);
    const filename = self.name;
    downloadJSON(filename, schema);
  },
}));

export type ViewModelInstance = Instance<typeof ViewModel>;
export type ViewModelSnapshotIn = SnapshotIn<ViewModelInstance>;
