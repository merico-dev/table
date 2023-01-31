import { Box } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useCreation, useRequest } from 'ahooks';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useInteractionOperationHacks } from '~/interactions/temp-hack';
import { createPluginContext, PluginContext } from '~/plugins';
import { ServiceLocatorProvider } from '~/service-locator/use-service-locator';
import { ReadOnlyDashboardView } from '~/view';
import { configureAPIClient } from '../api-caller/request';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { ModelContextProvider } from '../contexts/model-context';
import { createDashboardModel } from '../model';
import { ContextInfoType } from '../model/context';
import { IDashboard } from '../types/dashboard';
import { useTopLevelServices } from './use-top-level-services';
import './main.css';
import { listDataSources } from '~/api-caller';

interface IReadOnlyDashboard {
  context: ContextInfoType;
  dashboard: IDashboard;
  className?: string;
  config: IDashboardConfig;
  fullScreenPanelID: string;
  setFullScreenPanelID: (v: string) => void;
}

export const ReadOnlyDashboard = observer(
  ({
    context,
    dashboard,
    className = 'dashboard',
    config,
    fullScreenPanelID,
    setFullScreenPanelID,
  }: IReadOnlyDashboard) => {
    configureAPIClient(config);

    const { data: datasources = [] } = useRequest(listDataSources);

    const model = React.useMemo(() => createDashboardModel(dashboard, datasources, context), [dashboard]);
    useInteractionOperationHacks(model, false);

    React.useEffect(() => {
      model.context.replace(context);
    }, [context]);

    React.useEffect(() => {
      model.datasources.replace(datasources);
    }, [datasources]);

    const pluginContext = useCreation(createPluginContext, []);
    const configureServices = useTopLevelServices(pluginContext);
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
            <Box className={`${className} dashboard-root`}>
              <PluginContext.Provider value={pluginContext}>
                <ServiceLocatorProvider configure={configureServices}>
                  {model.views.visibleViews.map((view) => (
                    <ReadOnlyDashboardView
                      key={view.id}
                      view={view}
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
  },
);
