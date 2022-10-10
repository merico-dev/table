import { Box } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import _ from 'lodash';
import React from 'react';
import { ReadOnlyDashboardView } from '~/view';
import { APIClient } from '../api-caller/request';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { ModelContextProvider } from '../contexts/model-context';
import { Filters } from '../filter';
import { createDashboardModel } from '../model';
import { ContextInfoType } from '../model/context';
import { IDashboard, IDashboardConfig } from '../types/dashboard';
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

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  useStickyAreaStyle();
  return (
    <ModalsProvider>
      <ModelContextProvider value={model}>
        <LayoutStateContext.Provider
          value={{
            layoutFrozen: true,
            freezeLayout: _.noop,
            inEditMode: false,
            inUseMode: true,
          }}
        >
          <Box className={`${className} dashboard-root dashboard-sticky-parent`}>
            <Box className="dashboard-sticky-area">
              <Filters />
            </Box>
            {model.views.current.map((view) => (
              <ReadOnlyDashboardView key={view.id} view={view} />
            ))}
          </Box>
        </LayoutStateContext.Provider>
      </ModelContextProvider>
    </ModalsProvider>
  );
}
