import { useCreation, useRequest } from 'ahooks';
import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardAPI } from '../../../api-caller/dashboard';

const DashboardListItem = types.model('DashboardListItem', {
  id: types.identifier,
  name: types.string,
  is_preset: types.maybe(types.boolean),
  content: types.frozen<Record<string, $TSFixMe>>(),
  // for simplicity, use string for the date time type for now
  create_time: types.string,
  update_time: types.string,
});
export const DashboardStore = types
  .model('DashboardStore', {
    boardList: types.array(DashboardListItem),
    currentBoard: types.safeReference(DashboardListItem),
    loading: types.boolean,
  })
  .actions((self) => ({
    setBoardList(boardList: SnapshotIn<typeof DashboardListItem>[]) {
      self.boardList = cast(boardList);
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    setCurrentBoard(id: string) {
      self.currentBoard = self.boardList.find((b) => b.id === id);
    },
  }));

export const DashboardStoreContext = React.createContext<Instance<typeof DashboardStore> | null>(null);

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
    if (id && loading && data.length > 0) {
      store.setCurrentBoard(id);
    }
  }, [data, loading]);
  return <DashboardStoreContext.Provider value={store}>{children}</DashboardStoreContext.Provider>;
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
