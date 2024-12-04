import { Instance, SnapshotIn } from 'mobx-state-tree';
import { QueryRenderModel, QueryUsageType } from '~/model';
import { TransformQueryMetaInstance } from '~/model/meta-model/dashboard/content/query/transform-query';

export const QueryModel = QueryRenderModel.views((self) => ({
  get canPreviewData() {
    if (self.isTransform) {
      const config = self.config as TransformQueryMetaInstance;
      return config.dep_query_ids.length > 0 && !!self.pre_process;
    }
    return !!self.datasource;
  },
  get guideToPreviewData() {
    if (self.isTransform) {
      return 'Need to complete settings in Transform tab';
    }
    return 'Need to pick a Data Source first';
  },
  get usage() {
    return self.contentModel.findQueryUsage(self.id) as QueryUsageType[];
  },
  get runBySet() {
    return new Set(self.run_by);
  },
  keyInRunBy(key: string) {
    return this.runBySet.has(key);
  },
})).actions((self) => ({
  changeRunByRecord(key: string, checked: boolean) {
    const set = new Set(self.run_by);
    if (!checked) {
      set.delete(key);
    } else {
      set.add(key);
    }
    self.run_by.length = 0;
    self.run_by.push(...set);
  },
}));

export type QueryModelInstance = Instance<typeof QueryModel>;
export type QueryModelSnapshotIn = SnapshotIn<QueryModelInstance>;
