import { Box } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useCreation, useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useInteractionOperationHacks } from '~/interactions/temp-hack';
import { ServiceLocatorProvider } from '~/service-locator/use-service-locator';
import { MainDashboardView } from '~/view';
import { configureAPIClient } from '../api-caller/request';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { ModelContextProvider } from '../contexts/model-context';
import { createDashboardModel } from '../model';
import { ContextInfoType } from '../model/context';
import { useTopLevelServices } from './use-top-level-services';
import { createPluginContext, PluginContext } from '../plugins';
import { IDashboard } from '../types/dashboard';
import './main.css';
import { listDataSources } from '~/api-caller';

interface IDashboardProps {
  context: ContextInfoType;
  dashboard: IDashboard;
  className?: string;
  update: (dashboard: IDashboard) => Promise<void>;
  config: IDashboardConfig;
  fullScreenPanelID: string;
  setFullScreenPanelID: (v: string) => void;
}

export const Dashboard = observer(function _Dashboard({
  context,
  dashboard,
  update,
  className = 'dashboard',
  config,
  fullScreenPanelID,
  setFullScreenPanelID,
}: IDashboardProps) {
  configureAPIClient(config);

  const { data: datasources = [] } = useRequest(listDataSources);

  const [layoutFrozen, freezeLayout] = React.useState(false);

  const model = React.useMemo(() => createDashboardModel(dashboard, datasources, context), [dashboard]);
  useInteractionOperationHacks(model, true);

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  React.useEffect(() => {
    model.datasources.replace(datasources);
  }, [datasources]);

  const saveDashboardChanges = async () => {
    const queries = [...model.queries.json];
    const sqlSnippets = [...model.sqlSnippets.json];
    const views = [...model.views.json];
    const mock_context = { ...model.mock_context.current };
    const d: IDashboard = {
      ...dashboard,
      filters: [...model.filters.current],
      views,
      // @ts-expect-error IDashboard's Definition type is incorrect
      definition: { sqlSnippets, queries, mock_context },
    };
    await update(d);
  };

  const pluginContext = useCreation(createPluginContext, []);
  const configureServices = useTopLevelServices(pluginContext);
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
            className={`${className} dashboard-root`}
            sx={{
              position: 'relative',
            }}
          >
            <PluginContext.Provider value={pluginContext}>
              <ServiceLocatorProvider configure={configureServices}>
                {model.views.visibleViews.map((view) => (
                  <MainDashboardView
                    key={view.id}
                    view={view}
                    saveDashboardChanges={saveDashboardChanges}
                    fullScreenPanelID={fullScreenPanelID}
                    setFullScreenPanelID={setFullScreenPanelID}
                  />
                ))}
              </ServiceLocatorProvider>
            </PluginContext.Provider>
          </Box>
        </LayoutStateContext.Provider>
      </ModelContextProvider>
    </ModalsProvider>
  );
});
