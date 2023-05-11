import { Dashboard, IDashboard } from '@devtable/dashboard';
import { showNotification, updateNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { IDashboardModel } from '@devtable/dashboard';
import { reaction, toJS } from 'mobx';
import { APICaller } from '../../api-caller';
import { DashboardDetailModelInstance } from '../../frames/app/models/dashboard-detail-model';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { DashboardConfig } from '../../utils/config';
import { useRebaseModel } from './content-rebase-warning/rebase-editor/rebase-config-context';
import { MoreDashboardInfo } from './more-dashboard-info';

export const DashboardEditorPageContent = observer(
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
            console.log({ result });
            const d = dashboardModelRef.current?.json;
            if (d && result) {
              dashboardModelRef.current?.updateCurrent(d, result);
            }
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
      const result = await APICaller.dashboard.update(d);
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
    if (!dashboardModel.content.loaded) {
      return null;
    }

    console.log(dashboardModel.dashboard);

    return (
      <Dashboard
        ref={dashboardModelRef}
        onChange={rebaseModel.setLocalWithDashboard}
        context={context}
        dashboard={dashboardModel.dashboard}
        content={dashboardModel.content.fullData}
        update={updateDashboard}
        config={DashboardConfig}
        headerSlot={<MoreDashboardInfo />}
      />
    );
  },
);
