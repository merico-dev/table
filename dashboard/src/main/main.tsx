import { Box } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { useCreation } from 'ahooks';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { APIClient } from '../api-caller/request';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { ModelContextProvider } from '../contexts/model-context';
import { Filters } from '../filter';
import { DashboardLayout } from '../layout';
import { createDashboardModel } from '../model';
import { ContextInfoType } from '../model/context';
import { createPluginContext, PluginContext } from '../plugins';
import { TableVizComponent } from '../plugins/viz-components/table';
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

  const [panels, setPanels] = React.useState(dashboard.panels);
  const model = React.useMemo(() => createDashboardModel(dashboard, context), [dashboard]);

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  const hasChanges =
    model.panels.changed || model.sqlSnippets.changed || model.queries.changed || model.filters.changed;

  const saveDashboardChanges = async () => {
    const queries = [...model.queries.current];
    const sqlSnippets = [...model.sqlSnippets.current];
    const d: IDashboard = {
      ...dashboard,
      filters: [...model.filters.current],
      panels,
      definition: { sqlSnippets, queries },
    };
    await update(d);
  };

  const revertDashboardChanges = () => {
    model.filters.reset();
    model.panels.reset();
    model.sqlSnippets.reset();
    model.queries.reset();
  };

  const duplidatePanel = (id: string) => {
    try {
      const panel = panels.find((p) => p.id === id);
      if (!panel) {
        throw new Error(`[duplicate panel] Can't find a panel by id[${id}]`);
      }
      const newPanel = {
        ...panel,
        id: randomId(),
        layout: {
          ...panel.layout,
          x: 0,
          y: Infinity,
        },
      };
      setPanels((prevs) => [...prevs, newPanel]);
    } catch (error) {
      console.error(error);
    }
  };

  const inEditMode = mode === DashboardMode.Edit;
  const inUseMode = mode === DashboardMode.Use;

  const getCurrentSchema = React.useCallback(() => {
    const queries = model.queries.current;
    const sqlSnippets = model.sqlSnippets.current;
    const filters = model.filters.current;
    return {
      filters,
      panels,
      definition: {
        sqlSnippets,
        queries,
      },
    };
  }, [panels, model]);

  useStickyAreaStyle();

  const { viewPanelInFullScreen, exitFullScreen, inFullScreen, fullScreenPanel } = usePanelFullScreen(panels);

  const pluginContext = useCreation(createPluginContext, []);
  return (
    <ModalsProvider>
      <ModelContextProvider value={model}>
        <DashboardActionContext.Provider
          value={{
            duplidatePanel,
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
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {inFullScreen && <FullScreenPanel panel={fullScreenPanel!} exitFullScreen={exitFullScreen} />}
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
                  hasChanges={hasChanges}
                  saveChanges={saveDashboardChanges}
                  revertChanges={revertDashboardChanges}
                  getCurrentSchema={getCurrentSchema}
                />
                <Filters />
              </Box>
              <PluginContext.Provider value={pluginContext}>
                <DashboardLayout
                  panels={panels}
                  setPanels={setPanels}
                  isDraggable={inEditMode}
                  isResizable={inEditMode}
                />
              </PluginContext.Provider>
            </Box>
          </LayoutStateContext.Provider>
        </DashboardActionContext.Provider>
      </ModelContextProvider>
    </ModalsProvider>
  );
});
