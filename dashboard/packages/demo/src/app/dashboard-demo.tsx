import React from 'react';

import { Dashboard, ContextInfoContext, initialContextInfoContext, IDashboard } from '@devtable/dashboard'
import { Filters } from '../components/filters';

import { DEMO_COMMIT_DASHBOARD } from './demo-data';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './index.css'

export function DashboardDemo() {
  const [dashboard, setDashboard] = React.useState<IDashboard>(DEMO_COMMIT_DASHBOARD)

  const [context, setContext] = React.useState(initialContextInfoContext);

  const hasContext = React.useMemo(() => Object.keys(context).length > 0, [context]);
  return (
    <div className='dashboard-demo'>
      <ContextInfoContext.Provider value={context}>
        <Filters submit={setContext} />
        {hasContext && <Dashboard dashboard={dashboard}/>}
      </ContextInfoContext.Provider>
    </div>
  )
}
