import { useCreation, useRequest } from 'ahooks';
import _ from 'lodash';
import { cast, getSnapshot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { string } from 'mobx-state-tree/dist/internal';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardAPI } from '../../../api-caller/dashboard';
import { normalizeDBDashboard } from '../../../api-caller/dashboard.transform';

export const DashboardDetailModel = types
  .model('DashboardListItem', {
    id: types.identifier,
    name: types.string,
    group: types.string,
    is_preset: types.maybe(types.boolean),
    content: types.frozen<Record<string, $TSFixMe>>(),
    // for simplicity, use string for the date time type for now
    create_time: types.string,
    update_time: types.string,
    is_removed: types.boolean,
  })
  .views((self) => ({
    get isEditable() {
      return !self.is_preset;
    },
    get dashboard() {
      return normalizeDBDashboard(getSnapshot(self));
    },
  }));

export type DashboardDetailModelInstance = Instance<typeof DashboardDetailModel>;

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

export const DashboardStore = types
  .model('DashboardStore', {
    list: types.array(DashboardDetailModel),
    current: types.maybe(types.safeReference(DashboardDetailModel)),
    loading: types.boolean,
  })
  .views((self) => ({
    getByID(id: string) {
      return self.list.find((d) => d.id === id);
    },
    get groupedList() {
      return self.list
        .filter((d) => d.group)
        .reduce((ret, d) => {
          if (!ret[d.group]) {
            ret[d.group] = [];
          }
          ret[d.group].push(d);
          return ret;
        }, {} as Record<string, DashboardDetailModelInstance[]>);
    },
    get strayList() {
      return self.list.filter((d) => !d.group);
    },
  }))
  .actions((self) => ({
    setList(list: SnapshotIn<typeof DashboardDetailModel>[]) {
      self.list = cast(list);
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    setCurrent(id?: string) {
      self.current = self.list.find((b) => b.id === id);
    },
  }));

export const DashboardStoreContext = React.createContext<Instance<typeof DashboardStore> | null>(null);

function HooksHolder({ store }: { store: Instance<typeof DashboardStore> }) {
  const { id } = useParams();
  const { data = [], loading } = useRequest(
    async () => {
      const { data } = await DashboardAPI.list();
      return data;
    },
    {
      refreshDeps: [id],
    },
  );
  useEffect(() => {
    store.setList(data);
    store.setLoading(loading);
    store.setCurrent(id);
  }, [data, loading, id]);
  return null;
}

/**
 * Heavily relies on react router to get the id from the url
 * @param children
 * @constructor
 */
export function DashboardStoreProvider({ children }: { children: React.ReactNode }) {
  const store = useCreation(
    () =>
      DashboardStore.create({
        list: [],
        loading: false,
      }),
    [],
  );
  return (
    <DashboardStoreContext.Provider value={store}>
      <HooksHolder store={store} />
      {children}
    </DashboardStoreContext.Provider>
  );
}

export const useDashboardStore = () => {
  const store = React.useContext(DashboardStoreContext);
  if (!store) {
    throw new Error('DashboardStore is not initialized');
  }
  return {
    store,
  };
};
