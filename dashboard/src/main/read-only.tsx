import React from 'react';
import _ from 'lodash';
import { DashboardMode, IDashboard, IDashboardConfig } from '../types/dashboard';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { ReadOnlyDashboardLayout } from '../layout/read-only';
import { APIClient } from '../api-caller/request';
import { ModalsProvider } from '@mantine/modals';
import { usePanelFullScreen } from './use-panel-full-screen';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { Box } from '@mantine/core';
import { FullScreenPanel } from './full-screen-panel';
import { Filters } from '../filter';
import { createDashboardModel } from '../model';
import { ModelContextProvider } from '../contexts/model-context';
import { ContextInfoType } from '../model/context';
import './main.css';
import { useStickyAreaStyle } from './use-sticky-area-style';

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

  useStickyAreaStyle();
  return (
    <ModalsProvider>
      <ModelContextProvider value={model}>
        <DashboardActionContext.Provider
          value={{
            addPanel: _.noop,
            duplidatePanel: _.noop,
            removePanelByID: _.noop,
            viewPanelInFullScreen,
            inFullScreen,
          }}
        >
          <LayoutStateContext.Provider
            value={{
              layoutFrozen: true,
              freezeLayout: _.noop,
              mode: DashboardMode.Use,
              inEditMode: false,
              inUseMode: true,
            }}
          >
            {inFullScreen && <FullScreenPanel panel={fullScreenPanel!} exitFullScreen={exitFullScreen} />}
            <Box
              className={`${className} dashboard-root dashboard-sticky-parent`}
              sx={{ display: inFullScreen ? 'none' : 'block' }}
            >
              <Box className="dashboard-sticky-area">
                <Filters />
              </Box>
              <ReadOnlyDashboardLayout panels={dashboard.panels} />
            </Box>
          </LayoutStateContext.Provider>
        </DashboardActionContext.Provider>
      </ModelContextProvider>
    </ModalsProvider>
  );
}
