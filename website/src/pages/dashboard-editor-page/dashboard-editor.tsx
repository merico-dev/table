import useUrlState from '@ahooksjs/use-url-state';
import { Dashboard, IDashboard } from '@devtable/dashboard';
import { showNotification, updateNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { DashboardAPI } from '../../api-caller/dashboard';
import { DashboardDetailModelInstance } from '../../frames/app/models/dashboard-store';

export const DashboardEditor = observer(
  ({ dashboardModel, refresh }: { dashboardModel: DashboardDetailModelInstance; refresh: () => void }) => {
    const [search, setSearch] = useUrlState({
      full_screen_panel_id: '',
    });

    const [context] = React.useState({});

    const updateDashboard = React.useCallback(async (d: IDashboard) => {
      showNotification({
        id: 'for-updating',
        title: 'Pending',
        message: 'Updating dashboard...',
        loading: true,
      });
      await DashboardAPI.update(d);
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'This dashboard is updated',
        color: 'green',
      });
      refresh();
    }, []);

    const setFullScreenPanelID = (id: string) => {
      const s = {
        ...search,
        full_screen_panel_id: id,
      };
      setSearch(s);
    };

    return (
      <Dashboard
        context={context}
        dashboard={dashboardModel.dashboard}
        update={updateDashboard}
        config={{ apiBaseURL: import.meta.env.VITE_API_BASE_URL }}
        fullScreenPanelID={search.full_screen_panel_id}
        setFullScreenPanelID={setFullScreenPanelID}
      />
    );
  },
);
