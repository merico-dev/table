import React from 'react';

import { Dashboard, ContextInfoContext, initialContextInfoContext, IDashboard } from '@devtable/dashboard'
import { DEMO_PANELS } from "./demo.data";
import './index.css'
import { Filters } from '../components/filters';

const DEMO_DASHBOARD: IDashboard = {
  id: 'demo',
  name: 'Demo Dashboard',
  definition: {
    sqlSnippets: [{
      key: 'author_time_condition',
      value: "author_time BETWEEN '${timeRange?.[0].toISOString()}' AND '${timeRange?.[1].toISOString()}'"
    }],
  },
  panels: DEMO_PANELS,
}

export function DashboardDemo() {
  const [dashboard, setDashboard] = React.useState<IDashboard>(DEMO_DASHBOARD)

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
