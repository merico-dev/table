import useUrlState from '@ahooksjs/use-url-state';
import { AdditionalPanelMenuItem, ReadOnlyDashboard } from '@devtable/dashboard';
import { Divider, LoadingOverlay, Menu } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useRequest } from 'ahooks';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { getDashboardConfig } from '../../utils/config';
import { ErrorBoundary } from '../../utils/error-boundary';
import './content.css';
import { DashboardIsEmpty } from './placeholder';
import { useLanguageContext } from '../../contexts';

const DownloadChartData: AdditionalPanelMenuItem['render'] = ({ echartsOptions }) => {
  return <Menu.Item onClick={() => console.log(echartsOptions)}>下载图表数据</Menu.Item>;
};

const items = [
  {
    order: 11,
    render: () => <Divider color="red" variant="dashed" />,
  },
  {
    order: 12,
    render: DownloadChartData,
  },
  {
    order: 13,
    render: () => <Divider color="red" variant="dashed" />,
  },
];

export const DashboardPageContent = observer(() => {
  const { lang } = useLanguageContext();
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
        <LoadingOverlay
          visible
          transitionProps={{
            exitDuration: 0,
          }}
        />
      </div>
    );
  }

  if (!store.currentDetail?.content.fullData) {
    return (
      <div className="dashboard-page-content">
        <DashboardIsEmpty />
      </div>
    );
  }

  return (
    <div className="dashboard-page-content">
      <ErrorBoundary>
        <ReadOnlyDashboard
          context={context}
          dashboard={store.currentDetail.dashboard}
          content={store.currentDetail.content.fullData}
          config={dashboardConfig}
          fullScreenPanelID={search.full_screen_panel_id}
          setFullScreenPanelID={setFullScreenPanelID}
          lang={lang}
          additionalPanelMenuItems={items}
          // onFilterValuesChange={console.log}
        />
      </ErrorBoundary>
    </div>
  );
});
