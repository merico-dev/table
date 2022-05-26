import React from 'react';

import { Dashboard, ContextInfoContext, initialContextInfoContext, IDashboard } from '@devtable/dashboard'
import { Filters } from '../components/filters';

import { DEMO_PANELS } from "./demo.data";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './index.css'

const DEMO_DASHBOARD: IDashboard = {
  id: 'demo',
  name: 'Demo Dashboard',
  definition: {
    sqlSnippets: [{
      key: 'author_time_condition',
      value: "author_time BETWEEN '${timeRange?.[0].toISOString()}' AND '${timeRange?.[1].toISOString()}'"
    }, {
      key: 'repo_id_condition',
      value: `\${repoIDs.length > 0 ? \`repo_id IN (\${repoIDs.map(id => "'" + id + "'").join(",")})\` : 'TRUE' }`
    }, {
      key: 'author_email_condition',
      value: `\${emails.length > 0 ? \`author_email IN (\${emails.map(v => "'" + v + "'").join(",")})\` : 'TRUE' }`
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
