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
  const [mode, setMode] = React.useState<DashboardMode>(DashboardMode.Edit);

  const model = React.useMemo(() => createDashboardModel(dashboard, context), [dashboard]);

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  const saveDashboardChanges = async () => {
    const queries = [...model.queries.current];
    const sqlSnippets = [...model.sqlSnippets.current];
    const d: IDashboard = {
      ...dashboard,
      filters: [...model.filters.current],
      // @ts-expect-error Type 'string' is not assignable to type 'EViewComponentType'.
      views: [...model.views.current],
      definition: { sqlSnippets, queries },
    };
    await update(d);
  };

  const inEditMode = mode === DashboardMode.Edit;
  const inUseMode = mode === DashboardMode.Use;

  const getCurrentSchema = React.useCallback(() => {
    const queries = model.queries.current;
    const views = model.views.current;
    const sqlSnippets = model.sqlSnippets.current;
    const filters = model.filters.current;
    return {
      filters,
      views,
      definition: {
        sqlSnippets,
        queries,
      },
    };
  }, [model]);

  useStickyAreaStyle();

  // TODO: view-level fullsreen
  const { viewPanelInFullScreen, exitFullScreen, inFullScreen, fullScreenPanel } = usePanelFullScreen(
    // model.panels.json,
    [],
  );

  const pluginContext = useCreation(createPluginContext, []);
  return (
    <ModalsProvider>
      <ModelContextProvider value={model}>
        <DashboardActionContext.Provider
          value={{
            viewPanelInFullScreen,
            inFullScreen,
          }}
        >
          <LayoutStateContext.Provider
            value={{
              layoutFrozen,
              freezeLayout,
              mode,
              inEditMode,
              inUseMode,
            }}
          >
            <Box
              className={`${className} dashboard-root dashboard-sticky-parent`}
              sx={{
                position: 'relative',
                display: inFullScreen ? 'none' : 'block',
              }}
            >
              <Box className="dashboard-sticky-area">
                <DashboardActions
                  mode={mode}
                  setMode={setMode}
                  saveChanges={saveDashboardChanges}
                  getCurrentSchema={getCurrentSchema}
                />
                <Filters />
              </Box>
              <PluginContext.Provider value={pluginContext}>
                {model.views.current.map((view) => (
                  <MainDashboardView key={view.id} view={view} />
                ))}
              </PluginContext.Provider>
            </Box>
          </LayoutStateContext.Provider>
        </DashboardActionContext.Provider>
      </ModelContextProvider>
    </ModalsProvider>
  );
});
