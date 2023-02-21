import { getSnapshot, Instance, types } from 'mobx-state-tree';
import { normalizeDBDashboard } from '../../../api-caller/dashboard.transform';
import { DashboardBriefModel } from './dashboard-brief-model';

export const DashboardDetailModel = types
  .compose(
    'DashboardDetailModel',
    DashboardBriefModel,
    types.model({
      content: types.frozen<Record<string, $TSFixMe>>(),
    }),
  )
  .views((self) => ({
    get dashboard() {
      return normalizeDBDashboard(getSnapshot(self));
    },
  }));

export type DashboardDetailModelInstance = Instance<typeof DashboardDetailModel>;
