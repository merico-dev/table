import React from 'react';

import { Dashboard, initialContextInfoContext, IDashboard } from '@devtable/dashboard'
import { Filters } from '../../components/filters';

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './content.css'
import { useRequest } from 'ahooks';
import { DashboardAPI } from '../../api-caller/dashboard';
import { LoadingOverlay } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';

export function DashboardPageContent({ id }: { id: string }) {
  const { data: dashboard, loading, refresh } = useRequest(async () => {
    const resp = await DashboardAPI.details(id)
    return resp;
  }, {
    refreshDeps: [id]
  })

  const [context, setContext] = React.useState(initialContextInfoContext);

  const updateDashboard = React.useCallback(async (d: IDashboard) => {
    showNotification({
      id: 'for-updating',
      title: 'Pending',
      message: 'Updating dashboard...',
      loading: true,
    })
    await DashboardAPI.update(d)
    updateNotification({
      id: 'for-updating',
      title: 'Successful',
      message: 'This dashboard is updated',
      color: 'green'
    })
    refresh()
  }, [])

  if (!dashboard) {
    return null;
  }

  const ready = !loading;
  return (
    <div className='dashboard-page-content'>
      {/* <Filters context={context} submit={setContext} /> */}
      <LoadingOverlay visible={!ready} exitTransitionDuration={0} />
      {ready && (
        <Dashboard
          context={context}
          dashboard={dashboard}
          update={updateDashboard}
          config={{ apiBaseURL: 'http://localhost:31200/' }}
        />
      )}
    </div>
  )
}
