import { addDisposer, getEnv, Instance, types } from 'mobx-state-tree';
import { DashboardStore } from '../../../frames/app/models/dashboard-store';
import { IDashboard } from '@devtable/dashboard';
import React from 'react';
import { useCreation } from 'ahooks';
import { reaction } from 'mobx';

export interface RebaseConfigEnv {
  dashboardStore: Instance<typeof DashboardStore>;
}

export const RebaseConfigModel = types
  .model('RebaseConfigModel', {
    remote: types.maybe(types.frozen<IDashboard>()),
    local: types.maybe(types.frozen<IDashboard>()),
    rebaseResult: types.maybe(types.frozen<IDashboard>()),
  })
  .views((self) => ({
    get base() {
      const env = getEnv<RebaseConfigEnv>(self);
      return env.dashboardStore.currentDetail?.dashboard;
    },
  }))
  .actions((self) => ({
    setRemote(remote: IDashboard) {
      self.remote = remote;
    },
    setLocal(local: IDashboard) {
      self.local = local;
      self.rebaseResult = undefined;
    },
    setRebaseResult(rebaseResult?: IDashboard) {
      self.rebaseResult = rebaseResult;
    },
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(
          () => self.base,
          () => {
            self.setRebaseResult(undefined);
          },
        ),
      );
    },
  }));

const RebaseConfigContext = React.createContext<Instance<typeof RebaseConfigModel>>(
  null as unknown as Instance<typeof RebaseConfigModel>,
);

export function useRebaseModel() {
  return React.useContext(RebaseConfigContext);
}

export const RebaseConfigProvider = ({
  children,
  dashboardStore,
}: {
  children: React.ReactNode;
  dashboardStore: Instance<typeof DashboardStore>;
}) => {
  const model = useCreation(() => {
    return RebaseConfigModel.create({}, { dashboardStore } as RebaseConfigEnv);
  }, [dashboardStore]);
  return <RebaseConfigContext.Provider value={model}>{children}</RebaseConfigContext.Provider>;
};
