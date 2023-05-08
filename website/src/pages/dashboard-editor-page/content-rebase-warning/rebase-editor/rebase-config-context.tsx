import { addDisposer, getEnv, Instance, types } from 'mobx-state-tree';
import { DashboardStore } from '../../../../frames/app/models/dashboard-store';
import React from 'react';
import { useCreation } from 'ahooks';
import { reaction, toJS } from 'mobx';
import { DashboardContentDBType } from '../../../../api-caller/dashboard-content.types';
import { IDashboard } from '@devtable/dashboard';

export interface RebaseConfigEnv {
  dashboardStore: Instance<typeof DashboardStore>;
}

export const RebaseConfigModel = types
  .model('RebaseConfigModel', {
    remote: types.maybe(types.frozen<DashboardContentDBType>()),
    local: types.maybe(types.frozen<DashboardContentDBType>()),
    rebaseResult: types.maybe(types.frozen<DashboardContentDBType>()),
    resolvedRemotes: types.optional(types.map(types.number), {}),
  })
  .views((self) => ({
    get base() {
      const env = getEnv<RebaseConfigEnv>(self);
      return env.dashboardStore.currentDetail?.content.data;
    },
  }))
  .views((self) => ({
    get json() {
      return {
        base: toJS(self.base),
        local: toJS(self.local),
        remote: toJS(self.remote),
      };
    },
  }))
  .views((self) => ({
    get canMergeChanges() {
      const { base, local, remote } = self.json;
      return base && local && remote;
    },
  }))
  .actions((self) => ({
    setRemote(remote: DashboardContentDBType) {
      if (remote.id !== self.local?.id) {
        console.error('[RebaseConfigModel] local & remote id dont match');
        return;
      }

      self.remote = remote;
    },
    setLocalWithDashboard(d: IDashboard) {
      console.log(Object.keys(d));
    },
    setLocal(local: DashboardContentDBType) {
      console.log(local);
      self.local = local;
      self.rebaseResult = undefined;
    },
    setRebaseResult(rebaseResult?: DashboardContentDBType) {
      self.rebaseResult = rebaseResult;
    },
    markResolvedRemote(remoteId: string) {
      self.resolvedRemotes.set(remoteId, 1);
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

export type RebaseConfigModelInstance = Instance<typeof RebaseConfigModel>;

const RebaseConfigContext = React.createContext<RebaseConfigModelInstance>(
  null as unknown as RebaseConfigModelInstance,
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
