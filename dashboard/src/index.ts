import { ButtonProps } from '@mantine/core';
import './init-dayjs';
import './i18n';

export const getVersion = () =>
  import('../package.json').then(({ version }) => {
    console.log(`[@devtable/dashboard] version: ${version}`);
    return version;
  });

export * from './dashboard-editor';
export * from './dashboard-render';
export * from './components/view';
export * from './components/panel';
export { type IFormattedFilter, useVisibleFilters } from './components/filter';
export * from './contexts';
export * from './types';
export * from './model';
export * from './api-caller/request';
export type { AnyObject } from './types/utils';

// NOTE: keep it align with global.d.ts
export interface IDashboardConfig {
  basename: string;
  apiBaseURL: string;
  makeQueryENV?: () => Record<string, any>;
  app_id?: string;
  app_secret?: string;
  monacoPath: string;
  searchButtonProps: ButtonProps;
}

export { pluginManager, onVizRendered, notifyVizRendered } from './components/plugins';
export { type IPanelAddon, type IPanelAddonRenderProps } from './types/plugin';
