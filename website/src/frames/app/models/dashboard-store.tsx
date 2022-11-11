import { useCreation, useRequest } from 'ahooks';
import { cast, getSnapshot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardAPI } from '../../../api-caller/dashboard';
import { normalizeDBDashboard } from '../../../api-caller/dashboard.transform';

export const DashboardDetailModel = types
  .model('DashboardListItem', {
    id: types.identifier,
    name: types.string,
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
    boardList: types.array(DashboardDetailModel),
    currentBoard: types.maybe(types.safeReference(DashboardDetailModel)),
    loading: types.boolean,
  })
  .actions((self) => ({
    setBoardList(boardList: SnapshotIn<typeof DashboardDetailModel>[]) {
      self.boardList = cast(boardList);
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    setCurrentBoard(id?: string) {
      self.currentBoard = self.boardList.find((b) => b.id === id);
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
    store.setBoardList(data);
    store.setLoading(loading);
    store.setCurrentBoard(id);
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
        boardList: [],
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
