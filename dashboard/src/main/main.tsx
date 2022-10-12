import { Box } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useCreation } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { MainDashboardView } from '~/view';
import { APIClient } from '../api-caller/request';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { ModelContextProvider } from '../contexts/model-context';
import { Filters } from '../filter';
import { createDashboardModel } from '../model';
import { ContextInfoType } from '../model/context';
import { createPluginContext, PluginContext } from '../plugins';
import { DashboardMode, IDashboard, IDashboardConfig } from '../types/dashboard';
import { DashboardActions } from './actions';
import { FullScreenPanel } from './full-screen-panel';
import './main.css';
import { usePanelFullScreen } from './use-panel-full-screen';
import { useStickyAreaStyle } from './use-sticky-area-style';

interface IDashboardProps {
  context: ContextInfoType;
  dashboard: IDashboard;
  className?: string;
  update: (dashboard: IDashboard) => Promise<void>;
  config: IDashboardConfig;
}

export const Dashboard = observer(function _Dashboard({
  context,
  dashboard,
  update,
  className = 'dashboard',
  config,
}: IDashboardProps) {
  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }
  const [layoutFrozen, freezeLayout] = React.useState(false);

  const model = React.useMemo(() => createDashboardModel(dashboard, context), [dashboard]);

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  const saveDashboardChanges = async () => {
    const queries = [...model.queries.current];
    const sqlSnippets = [...model.sqlSnippets.current];
    const views = [...model.views.json];
    const d: IDashboard = {
      ...dashboard,
      filters: [...model.filters.current],
      // @ts-expect-error Type 'string' is not assignable to type 'EViewComponentType'.
      views,
      definition: { sqlSnippets, queries },
    };
    await update(d);
  };

  useStickyAreaStyle();

  const pluginContext = useCreation(createPluginContext, []);
  return (
    <ModalsProvider>
      <ModelContextProvider value={model}>
        <LayoutStateContext.Provider
          value={{
            layoutFrozen,
            freezeLayout,
            inEditMode: true,
            inUseMode: false,
          }}
        >
          <Box
            className={`${className} dashboard-root dashboard-sticky-parent`}
            sx={{
              position: 'relative',
            }}
          >
            <PluginContext.Provider value={pluginContext}>
              {model.views.current.map((view) => (
                <MainDashboardView key={view.id} view={view} saveDashboardChanges={saveDashboardChanges} />
              ))}
            </PluginContext.Provider>
          </Box>
        </LayoutStateContext.Provider>
      </ModelContextProvider>
    </ModalsProvider>
  );
});
