import { useCreation, useRequest } from 'ahooks';
import { cast, SnapshotIn, types } from 'mobx-state-tree';
import { useEffect } from 'react';
import { DashboardAPI } from '../../../api-caller/dashboard';
import { DashboardDetailModel } from './dashboard-detail-model';

const DashboardDetailQuery = types
  .model('DashboardDetailQuery', {
    data: types.maybe(DashboardDetailModel),
  })
  .actions((self) => ({
    setState(data?: SnapshotIn<typeof DashboardDetailModel>) {
      self.data = cast(data);
    },
  }));

export const useDashboardDetailQuery = ({ id }: { id: string }) => {
  const model = useCreation(() => DashboardDetailQuery.create(), []);
  const { data, loading, refresh } = useRequest(
    async () => {
      return await DashboardAPI.details(id);
    },
    {
      refreshDeps: [id],
    },
  );
  useEffect(() => {
    model.setState(data);
  }, [data, loading]);
  return { data: model.data, refresh, loading };
};
