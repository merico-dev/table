import { Box } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import _ from 'lodash';
import React from 'react';
import { ReadOnlyDashboardView } from '~/view';
import { APIClient } from '../api-caller/request';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { ModelContextProvider } from '../contexts/model-context';
import { Filters } from '../filter';
import { createDashboardModel } from '../model';
import { ContextInfoType } from '../model/context';
import { DashboardMode, IDashboard, IDashboardConfig } from '../types/dashboard';
import { FullScreenPanel } from './full-screen-panel';
import './main.css';
import { usePanelFullScreen } from './use-panel-full-screen';
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

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  // TODO: view-level fullsreen
  const { viewPanelInFullScreen, exitFullScreen, inFullScreen, fullScreenPanel } = usePanelFullScreen(
    // model.panels.json,
    [],
  );

  useStickyAreaStyle();
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
              layoutFrozen: true,
              freezeLayout: _.noop,
              mode: DashboardMode.Use,
              inEditMode: false,
              inUseMode: true,
            }}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {inFullScreen && <FullScreenPanel panel={fullScreenPanel!} exitFullScreen={exitFullScreen} />}
            <Box
              className={`${className} dashboard-root dashboard-sticky-parent`}
              sx={{ display: inFullScreen ? 'none' : 'block' }}
            >
              <Box className="dashboard-sticky-area">
                <Filters />
              </Box>
              {model.views.current.map((view) => (
                <ReadOnlyDashboardView view={view} />
              ))}
            </Box>
          </LayoutStateContext.Provider>
        </DashboardActionContext.Provider>
      </ModelContextProvider>
    </ModalsProvider>
  );
}
