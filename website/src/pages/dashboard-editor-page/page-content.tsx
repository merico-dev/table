import { Dashboard, IDashboard } from '@devtable/dashboard';
import { showNotification, updateNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { DashboardAPI } from '../../api-caller/dashboard';
import { DashboardDetailModelInstance } from '../../frames/app/models/dashboard-detail-model';
import { DashboardConfig } from '../../utils/config';
import { IDashboardModel } from '@devtable/dashboard';
import { useRebaseModel } from './dashboard-rebase-warning/rebase-editor/rebase-config-context';
import { reaction, toJS } from 'mobx';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';

export const DashboardEditprPageContent = observer(
  ({ dashboardModel, refresh }: { dashboardModel: DashboardDetailModelInstance; refresh: () => void }) => {
    const { store } = useDashboardStore();
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

    const updateDashboard = async (d: IDashboard) => {
      showNotification({
        id: 'for-updating',
        title: 'Pending',
        message: 'Updating dashboard...',
        loading: true,
      });
      const result = await DashboardAPI.update(d);
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'This dashboard is updated',
        color: 'green',
      });
      store.setCurrentDetail(result);
      refresh();
    };

    if (!rebaseModel) {
      return null;
    }

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
