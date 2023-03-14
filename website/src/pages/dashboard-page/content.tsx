import useUrlState from '@ahooksjs/use-url-state';
import { ReadOnlyDashboard } from '@devtable/dashboard';
import { LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import 'react-grid-layout/css/styles.css';
import { Helmet } from 'react-helmet-async';
import 'react-resizable/css/styles.css';

import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { DashboardConfig } from '../../utils/config';
import { ErrorBoundary } from '../../utils/error-boundary';
import './content.css';

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

  if (!store.currentDetail) {
    return null;
  }

  const ready = !store.detailsLoading;

  return (
    <div className="dashboard-page-content">
      <Helmet>
        <title>{store.currentDetail.name}</title>
      </Helmet>
      <LoadingOverlay visible={!ready} exitTransitionDuration={0} />
      {ready && (
        <ErrorBoundary>
          <ReadOnlyDashboard
            context={context}
            dashboard={store.currentDetail.dashboard}
            config={DashboardConfig}
            fullScreenPanelID={search.full_screen_panel_id}
            setFullScreenPanelID={setFullScreenPanelID}
          />
        </ErrorBoundary>
      )}
    </div>
  );
});
