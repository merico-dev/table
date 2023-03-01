import { AppShell, Box } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useCreation, useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useInteractionOperationHacks } from '~/interactions/temp-hack';
import { ServiceLocatorProvider } from '~/service-locator/use-service-locator';
import { DashboardViewEditor } from '~/view';
import { configureAPIClient } from '~/api-caller/request';
import { LayoutStateContext } from '~/contexts/layout-state-context';
import { ModelContextProvider } from '~/contexts/model-context';
import { createDashboardModel, ContextInfoType } from '~/model';
import { useTopLevelServices } from '../use-top-level-services';
import { createPluginContext, PluginContext } from '~/plugins';
import { IDashboard } from '../../types/dashboard';
import { listDataSources } from '~/api-caller';
import './index.css';
import { DashboardEditorHeader } from './header';
import { DashboardEditorNavbar } from './navbar';
import { Settings } from './settings';
import { useLoadMonacoEditor } from './utils/load-monaco-editor';

const AppShellStyles = {
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  body: {
    flexGrow: 1,
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 60,
    height: '100vh',
  },
} as const;

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
  useLoadMonacoEditor(config.basename);
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
      definition: { queries, sqlSnippets, mock_context },
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
          }}
        >
          <PluginContext.Provider value={pluginContext}>
            <ServiceLocatorProvider configure={configureServices}>
              <AppShell
                padding={0}
                header={<DashboardEditorHeader saveDashboardChanges={saveDashboardChanges} />}
                navbar={<DashboardEditorNavbar />}
                styles={AppShellStyles}
              >
                <Box
                  className={`${className} dashboard-root`}
                  sx={{
                    position: 'relative',
                  }}
                >
                  {model.views.visibleViews.map((view) => (
                    <DashboardViewEditor key={view.id} view={view} />
                  ))}
                </Box>
              </AppShell>
              <Settings />
            </ServiceLocatorProvider>
          </PluginContext.Provider>
        </LayoutStateContext.Provider>
      </ModelContextProvider>
    </ModalsProvider>
  );
});
