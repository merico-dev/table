import { Instance, SnapshotIn } from 'mobx-state-tree';
import { QueryRenderModel } from '~/model';

export const QueryModel = QueryRenderModel.views((self) => ({
  get canPreviewData() {
    if (self.isTransform) {
      return self.dep_query_ids.length > 0 && !!self.pre_process;
    }
    return !!self.datasource;
  },
  get guideToPreviewData() {
    if (self.isTransform) {
      return 'Need to complete settings in Transform tab';
    }
    return 'Need to pick a Data Source first';
  },
}));

export type QueryModelInstance = Instance<typeof QueryModel>;
export type QueryModelSnapshotIn = SnapshotIn<QueryModelInstance>;
