import { getSnapshot, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { normalizeDBDashboard } from '../../../api-caller/dashboard.transform';
import { DashboardBriefModel } from './dashboard-brief-model';
import { DashboardContentModel } from './dashboard-content-model';

export const DashboardDetailModel = types
  .compose(
    'DashboardDetailModel',
    DashboardBriefModel,
    types.model({
      content: DashboardContentModel,
    }),
  )
  .views((self) => ({
    get dashboard() {
      const snap = getSnapshot(self);
      return normalizeDBDashboard(snap);
    },
  }));

export type DashboardDetailModelInstance = Instance<typeof DashboardDetailModel>;
export type DashboardDetailModelSnapshotOut = SnapshotOut<typeof DashboardDetailModel>;
