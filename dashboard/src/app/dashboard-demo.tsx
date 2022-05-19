import React from 'react';

import { DashboardLayout } from '../components/dashboard-layout'
import { IDashboardItem } from '../types/dashboard';
import { DEMO_ITEMS } from "./demo.data";
import './index.css'
import { Filters } from '../components/filters';
import ContextInfoContext, { initialContext } from '../contexts/context-info-context';

export function DashboardDemo() {
  const [dashboard, setDashboard] = React.useState<IDashboardItem[]>(DEMO_ITEMS)

  const [context, setContext] = React.useState(initialContext);

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
