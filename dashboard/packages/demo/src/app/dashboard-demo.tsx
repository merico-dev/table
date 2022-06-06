import React from 'react';

import { Dashboard, ContextInfoContext, initialContextInfoContext, IDashboard } from '@devtable/dashboard'
import { Filters } from '../components/filters';

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './index.css'
import { useRequest } from 'ahooks';
import { DashboardAPI } from '../api-caller/dashboard';
import { LoadingOverlay } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';

export function DashboardDemo({ id }: { id: string }) {
  const { data: dashboard, loading, refresh } = useRequest(async () => {
    const resp = await DashboardAPI.details(id)
    return resp;
  }, {
    refreshDeps: [id]
  })

  const [context, setContext] = React.useState(initialContextInfoContext);

  const hasContext = React.useMemo(() => Object.keys(context).length > 0, [context]);

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

  const ready = hasContext && !loading;
  return (
    <div className='dashboard-demo'>
      <ContextInfoContext.Provider value={{ ...context }}>
        <Filters submit={setContext} />
        <LoadingOverlay visible={loading || !hasContext} />
        {ready && <Dashboard dashboard={dashboard} update={updateDashboard} />}
      </ContextInfoContext.Provider>
    </div>
  )
}
