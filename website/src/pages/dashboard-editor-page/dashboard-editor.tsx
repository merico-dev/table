import { Dashboard, IDashboard } from '@devtable/dashboard';
import { showNotification, updateNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { DashboardAPI } from '../../api-caller/dashboard';
import { DashboardDetailModelInstance } from '../../frames/app/models/dashboard-detail-model';
import { DashboardConfig } from '../../utils/config';
import { IDashboardModel } from '@devtable/dashboard/src';
import { useRebaseModel } from './rebase-editor/rebase-config-context';
import { reaction, toJS } from 'mobx';

export const DashboardEditor = observer(
  ({ dashboardModel, refresh }: { dashboardModel: DashboardDetailModelInstance; refresh: () => void }) => {
    const [context] = React.useState({});
    const rebaseModel = useRebaseModel();

    const dashboardModelRef = React.useRef<IDashboardModel>(null);

    React.useEffect(() => {
      return reaction(
        () => toJS(rebaseModel.rebaseResult),
        (result) => {
          if (result) {
            dashboardModelRef.current?.updateCurrent(result);
          }
        },
      );
    }, [rebaseModel, dashboardModelRef]);

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

    return (
      <Dashboard
        ref={dashboardModelRef}
        onChange={rebaseModel.setLocal}
        context={context}
        dashboard={dashboardModel.dashboard}
        update={updateDashboard}
        config={DashboardConfig}
      />
    );
  },
);
