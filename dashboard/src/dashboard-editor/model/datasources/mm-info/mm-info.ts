import { getParent, getRoot, Instance, types } from 'mobx-state-tree';
import { TAdditionalQueryInfo } from '~/api-caller/request';
import { MetricDetailModel } from './metric-detail';
import { MetricsModel } from './metrics';

export const MMInfoModel = types
  .model({
    metrics: types.optional(MetricsModel, {}),
    metricDetail: types.optional(MetricDetailModel, {}),
    keyword: types.optional(types.string, ''),
    metricID: types.optional(types.string, ''),
  })
  .views((self) => ({
    get rootModel(): any {
      return getRoot(self);
    },
    get contentModel(): any {
      return this.rootModel.content; // dashboard content model
    },
    get additionalQueryInfo(): TAdditionalQueryInfo {
      return this.contentModel.getAdditionalQueryInfo('');
    },
    get dataSource() {
      return getParent(self) as any;
    },
    get key() {
      return this.dataSource.key;
    },
    get type() {
      return this.dataSource.type;
    },
    get metric() {
      if (!self.metricID) {
        return null;
      }
      return self.metrics.data.find((m) => m.id === self.metricID) ?? null;
    },
  }))
  .actions((self) => ({
    selectMetric(metricID: string) {
      self.metricID = metricID;
    },
  }));

export type MMInfoModelInstance = Instance<typeof MMInfoModel>;
