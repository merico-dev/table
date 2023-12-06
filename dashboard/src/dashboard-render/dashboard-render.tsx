import { Box } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useCreation, useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { listDataSources, listGlobalSQLSnippets } from '~/api-caller';
import { PluginContext, createPluginContext } from '~/components/plugins';
import { ServiceLocatorProvider } from '~/components/plugins/service/service-locator/use-service-locator';
import { DashboardViewRender } from '~/components/view';
import { DashboardThemeContextProvider, FullScreenPanelContext } from '~/contexts';
import { ContentModelContextProvider } from '~/contexts/content-model-context';
import { useInteractionOperationHacks } from '~/interactions/temp-hack';
import { ContextRecordType } from '~/model';
import { registerThemes } from '~/styles/register-themes';
import { IDashboardConfig } from '..';
import { configureAPIClient } from '../api-caller/request';
import { useTopLevelServices } from '../components/plugins/service/use-top-level-services';
import { DashboardModelContextProvider } from '../contexts/dashboard-context';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { DashboardContentDBType, IDashboard } from '../types/dashboard';
import './dashboard-render.css';
import { createDashboardRenderModel } from './model';

registerThemes();

interface IReadOnlyDashboard {
  context: ContextRecordType;
  dashboard: IDashboard;
  content: DashboardContentDBType;
  className?: string;
  config: IDashboardConfig;
  fullScreenPanelID: string;
  setFullScreenPanelID: (v: string) => void;
}

const _ReadOnlyDashboard = ({
  context,
  dashboard,
  content,
  className = 'dashboard',
  config,
  fullScreenPanelID,
  setFullScreenPanelID,
}: IReadOnlyDashboard) => {
  configureAPIClient(config);

  const { data: datasources = [] } = useRequest(listDataSources);
  const { data: globalSQLSnippets = [] } = useRequest(listGlobalSQLSnippets);

  const model = React.useMemo(
    () => createDashboardRenderModel(dashboard, content, datasources, globalSQLSnippets, context),
    [dashboard, content],
  );
  useInteractionOperationHacks(model.content, false);

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  React.useEffect(() => {
    model.datasources.replace(datasources);
  }, [datasources]);

  React.useEffect(() => {
    model.globalSQLSnippets.replace(globalSQLSnippets);
  }, [globalSQLSnippets]);

  const pluginContext = useCreation(createPluginContext, []);
  const configureServices = useTopLevelServices(pluginContext);
  return (
    <ModalsProvider>
      <DashboardThemeContextProvider value={{ searchButtonProps: config.searchButtonProps }}>
        <DashboardModelContextProvider value={model}>
          <ContentModelContextProvider value={model.content}>
            <FullScreenPanelContext.Provider
              value={{
                fullScreenPanelID,
                setFullScreenPanelID,
              }}
            >
              <LayoutStateContext.Provider
                value={{
                  inEditMode: false,
                }}
              >
                <Box className={`${className} dashboard-root`}>
                  <PluginContext.Provider value={pluginContext}>
                    <ServiceLocatorProvider configure={configureServices}>
                      {model.content.views.visibleViews.map((view) => (
                        <DashboardViewRender key={view.id} view={view} />
                      ))}
                    </ServiceLocatorProvider>
                  </PluginContext.Provider>
                </Box>
              </LayoutStateContext.Provider>
            </FullScreenPanelContext.Provider>
          </ContentModelContextProvider>
        </DashboardModelContextProvider>
      </DashboardThemeContextProvider>
    </ModalsProvider>
  );
};

export const ReadOnlyDashboard = observer(_ReadOnlyDashboard);
