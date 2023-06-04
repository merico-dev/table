import useUrlState from '@ahooksjs/use-url-state';
import { ReadOnlyDashboard } from '@devtable/dashboard';
import { LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import 'react-grid-layout/css/styles.css';
import { Helmet } from 'react-helmet-async';
import 'react-resizable/css/styles.css';

import { useRequest } from 'ahooks';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { getDashboardConfig } from '../../utils/config';
import { ErrorBoundary } from '../../utils/error-boundary';
import './content.css';
import { DashboardIsEmpty } from './placeholder';

export const DashboardPageContent = observer(() => {
  const { store } = useDashboardStore();
  const [search, setSearch] = useUrlState({
    full_screen_panel_id: '',
  });

  const [context] = React.useState({});

  const setFullScreenPanelID = (id: string) => {
    const s = {
      ...search,
      full_screen_panel_id: id,
    };
    setSearch(s);
  };

  const { data: dashboardConfig } = useRequest(getDashboardConfig, {
    refreshDeps: [],
  });

  if (!store.currentDetail?.content.loaded) {
    return null;
  }

  if (store.detailsLoading || !dashboardConfig) {
    return (
      <div className="dashboard-page-content">
        <Helmet>
          <title>{store.currentDetail.name}</title>
        </Helmet>
        <LoadingOverlay visible exitTransitionDuration={0} />
      </div>
    );
  }

  if (!store.currentDetail?.content.fullData) {
    return (
      <div className="dashboard-page-content">
        <Helmet>
          <title>{store.currentDetail.name}</title>
        </Helmet>
        <DashboardIsEmpty />
      </div>
    );
  }

  return (
    <div className="dashboard-page-content">
      <Helmet>
        <title>{store.currentDetail.name}</title>
      </Helmet>
      <ErrorBoundary>
        <ReadOnlyDashboard
          context={context}
          dashboard={store.currentDetail.dashboard}
          content={store.currentDetail.content.fullData}
          config={dashboardConfig}
          fullScreenPanelID={search.full_screen_panel_id}
          setFullScreenPanelID={setFullScreenPanelID}
        />
      </ErrorBoundary>
    </div>
  );
});
