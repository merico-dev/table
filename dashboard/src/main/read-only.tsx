import React from 'react';
import _ from 'lodash';
import { DashboardMode, IDashboard, IDashboardConfig } from '../types/dashboard';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { DefinitionContext } from '../contexts/definition-context';
import { ReadOnlyDashboardLayout } from '../layout/read-only';
import { FilterValuesContext } from '../contexts';
import { APIClient } from '../api-caller/request';
import { ModalsProvider } from '@mantine/modals';
import { usePanelFullScreen } from './use-panel-full-screen';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { Box } from '@mantine/core';
import { FullScreenPanel } from './full-screen-panel';
import { Filters } from '../filter';
import { createDashboardModel } from '../model';
import { ModelContext } from '../contexts/model-context';
import { ContextInfoType } from '../model/context';

interface IReadOnlyDashboard {
  context: ContextInfoType;
  dashboard: IDashboard;
  className?: string;
  config: IDashboardConfig;
}

export function ReadOnlyDashboard({ context, dashboard, className = 'dashboard', config }: IReadOnlyDashboard) {
  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }
  const model = React.useMemo(() => createDashboardModel(dashboard, context), [dashboard]);

  const { viewPanelInFullScreen, exitFullScreen, inFullScreen, fullScreenPanel } = usePanelFullScreen(dashboard.panels);

  return (
    <ModalsProvider>
      <ModelContext.Provider value={{ model }}>
        <FilterValuesContext.Provider value={model.filters.values}>
          <DashboardActionContext.Provider
            value={{
              addPanel: _.noop,
              duplidatePanel: _.noop,
              removePanelByID: _.noop,
              viewPanelInFullScreen,
              inFullScreen,
            }}
          >
            <DefinitionContext.Provider value={{}}>
              <LayoutStateContext.Provider
                value={{
                  layoutFrozen: true,
                  freezeLayout: () => {},
                  mode: DashboardMode.Use,
                  inEditMode: false,
                  inLayoutMode: false,
                  inUseMode: true,
                }}
              >
                {inFullScreen && (
                  <FullScreenPanel panel={fullScreenPanel!} exitFullScreen={exitFullScreen} model={model} />
                )}
                <Box className={className} sx={{ display: inFullScreen ? 'none' : 'block' }}>
                  <Filters />
                  <ReadOnlyDashboardLayout panels={dashboard.panels} model={model} />
                </Box>
              </LayoutStateContext.Provider>
            </DefinitionContext.Provider>
          </DashboardActionContext.Provider>
        </FilterValuesContext.Provider>
      </ModelContext.Provider>
    </ModalsProvider>
  );
}
