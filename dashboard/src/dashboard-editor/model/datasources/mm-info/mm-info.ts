import { getParent, types } from 'mobx-state-tree';
import { MetricBriefInfo, MetricsModel } from './metrics';

export const MMInfoModel = types
  .model({
    metrics: types.optional(MetricsModel, {}),
    // metricDetail: types.optional(MetricDetailModel, {}),
    keyword: types.optional(types.string, ''),
    metricID: types.optional(types.string, ''),
  })
  .views((self) => ({
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
    selectMetric(metricID: string | null) {
      self.metricID = metricID ?? '';
    },
  }));
