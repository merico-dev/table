import React from 'react';

import { DashboardLayout, IDashboardItem, ContextInfoContext, initialContextInfoContext } from 'dashboard'
import { DEMO_ITEMS } from "./demo.data";
import './index.css'
import { Filters } from '../components/filters';

export function DashboardDemo() {
  const [dashboard, setDashboard] = React.useState<IDashboardItem[]>(DEMO_ITEMS)

  const [context, setContext] = React.useState(initialContextInfoContext);

  const hasContext = React.useMemo(() => Object.keys(context).length > 0, [context]);
  return (
    <div className='dashboard-demo'>
      <ContextInfoContext.Provider value={context}>
        <Filters submit={setContext} />
        {hasContext && <DashboardLayout dashboard={dashboard}/>}
      </ContextInfoContext.Provider>
    </div>
  )
}
