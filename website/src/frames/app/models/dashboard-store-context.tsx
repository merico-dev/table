import { Instance } from 'mobx-state-tree';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardStore } from './dashboard-store';

export const DashboardStoreContext = React.createContext<Instance<typeof DashboardStore> | null>(null);

function HooksHolder({ store }: { store: Instance<typeof DashboardStore> }) {
  const { id } = useParams();
  useEffect(() => {
    store.setCurrentID(id);
  }, [id]);
  return null;
}

/**
 * Heavily relies on react router to get the id from the url
 * @param children
 * @constructor
 */
export function DashboardStoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(
    () =>
      DashboardStore.create({
        list: [],
        loading: false,
        detailsLoading: false,
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
