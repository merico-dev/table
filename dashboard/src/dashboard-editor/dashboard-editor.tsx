import { AppShell, Box } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useCreation, useRequest } from 'ahooks';
import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { ForwardedRef, ReactNode, forwardRef, useEffect } from 'react';
import { listDataSources, listGlobalSQLSnippets } from '~/api-caller';
import { configureAPIClient } from '~/api-caller/request';
import { PluginContext, createPluginContext } from '~/components/plugins';
import { ServiceLocatorProvider } from '~/components/plugins/service/service-locator/use-service-locator';
import { DashboardViewEditor } from '~/components/view';

import { createDashboardModel } from '~/dashboard-editor/model';
import { useInteractionOperationHacks } from '~/interactions/temp-hack';
import { ContextRecordType } from '~/model';
import { registerThemes } from '~/styles/register-themes';
import { useTopLevelServices } from '../components/plugins/service/use-top-level-services';
import { DashboardContentDBType, IDashboard } from '../types/dashboard';
import './dashboard-editor.css';
import { DashboardEditorHeader, DashboardEditorNavbar, Settings } from './ui';
import { useLoadMonacoEditor } from './utils/load-monaco-editor';
import { DashboardThemeContextProvider, IDashboardConfig } from '..';
import { OnExitCallback } from '~/dashboard-editor/ui/header/main-header';
import { registerECharts } from '~/utils';
import { useTranslation } from 'react-i18next';
import {
  DatesProvider,
  ContentModelContextProvider,
  DashboardModelContextProvider,
  LayoutStateContext,
} from '~/contexts';

registerThemes();
registerECharts();

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
    paddingTop: 60 + 30, // main header & sub header
    height: '100vh',
  },
} as const;

interface IDashboardProps {
  context: ContextRecordType;
  dashboard: IDashboard;
  content: DashboardContentDBType;
  className?: string;
  update: (d: IDashboard, c: DashboardContentDBType) => Promise<void>;
  config: IDashboardConfig;
  onChange?: (dashboard: IDashboard) => void;
  headerSlot?: ReactNode;
  filterValues?: Record<string, any>;
  onFilterValuesChange?: (filterValues: Record<string, any>) => void;
  onExit: OnExitCallback;
  lang: string;
}

export interface IDashboardModel {
  readonly json: IDashboard;
  updateCurrent: (dashboard: IDashboard, content: DashboardContentDBType) => void;
  updateCurrentContent: (content: DashboardContentDBType) => void;
}

const _DashboardEditor = (
  {
    context,
    dashboard,
    content,
    update,
    className = 'dashboard',
    config,
    onChange,
    headerSlot,
    filterValues,
    onFilterValuesChange,
    onExit,
    lang,
  }: IDashboardProps,
  ref: ForwardedRef<IDashboardModel>,
) => {
  useLoadMonacoEditor(config.monacoPath);
  configureAPIClient(config);
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const { data: datasources = [] } = useRequest(listDataSources);
  const { data: globalSQLSnippets = [] } = useRequest(listGlobalSQLSnippets);

  const model = React.useMemo(
    () => createDashboardModel(dashboard, content, datasources, globalSQLSnippets, context, filterValues ?? {}),
    [dashboard, content],
  );
  React.useImperativeHandle(ref, () => model, [model]);
  useInteractionOperationHacks(model.content, true);

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  React.useEffect(() => {
    model.datasources.replace(datasources);
  }, [datasources]);

  React.useEffect(() => {
    model.globalSQLSnippets.replace(globalSQLSnippets);
  }, [globalSQLSnippets]);

  React.useEffect(() => {
    onFilterValuesChange?.(model.content.filters.values);
  }, [onFilterValuesChange, model.content.filters.values]);

  React.useEffect(() => {
    if (filterValues) {
      model.content.filters.patchValues(filterValues);
    }
  }, [filterValues, model.content.filters.patchValues]);

  React.useEffect(() => {
    return reaction(
      () => toJS(model.json),
      (json) => {
        onChange?.(json);
      },
    );
  }, [model]);

  const saveDashboardChanges = async () => {
    await update(model.json, model.content.json);
  };

  const pluginContext = useCreation(createPluginContext, []);
  const configureServices = useTopLevelServices(pluginContext);
  return (
    <ModalsProvider>
      <DatesProvider>
        <DashboardThemeContextProvider value={{ searchButtonProps: config.searchButtonProps }}>
          <DashboardModelContextProvider value={model}>
            <ContentModelContextProvider value={model.content}>
              <LayoutStateContext.Provider
                value={{
                  inEditMode: true,
                }}
              >
                <PluginContext.Provider value={pluginContext}>
                  <ServiceLocatorProvider configure={configureServices}>
                    <AppShell
                      padding={0}
                      header={
                        <DashboardEditorHeader
                          onExit={onExit}
                          saveDashboardChanges={saveDashboardChanges}
                          headerSlot={headerSlot}
                        />
                      }
                      navbar={<DashboardEditorNavbar />}
                      styles={AppShellStyles}
                    >
                      <Box
                        className={`${className} dashboard-root`}
                        sx={{
                          position: 'relative',
                        }}
                      >
                        {model.content.views.visibleViews.map((view) => (
                          <DashboardViewEditor key={view.id} view={view} />
                        ))}
                      </Box>
                    </AppShell>
                    <Settings />
                  </ServiceLocatorProvider>
                </PluginContext.Provider>
              </LayoutStateContext.Provider>
            </ContentModelContextProvider>
          </DashboardModelContextProvider>
        </DashboardThemeContextProvider>
      </DatesProvider>
    </ModalsProvider>
  );
};

export const DashboardEditor = observer(forwardRef(_DashboardEditor));

export type { OnExitCallback, OnExitParams } from './ui';
