import { ReactNode } from 'react';
import './i18n';
import './init-dayjs';

export const getVersion = () =>
  import('../package.json').then(({ version }) => {
    console.log(`[@devtable/dashboard] version: ${version}`);
    return version;
  });

export * from './api-caller/request';
export { useVisibleFilters, type IFormattedFilter } from './components/filter';
export * from './components/panel';
export * from './components/view';
export * from './contexts';
export * from './dashboard-editor';
export * from './dashboard-render';
export * from './model';
export * from './types';
export type { AnyObject } from './types/utils';

export type OnFiltersSubmit = (props?: { force?: boolean }) => void;

export type RenderSearchButtonProps = {
  disabled: boolean;
  onSubmit: OnFiltersSubmit;
  stale: boolean;
};

export interface IDashboardConfig {
  basename: string;
  apiBaseURL: string;
  makeQueryENV?: () => Record<string, any>;
  app_id?: string;
  app_secret?: string;
  monacoPath: string;
  renderSearchButton?: (props: RenderSearchButtonProps) => ReactNode;
}

export {
  notifyVizRendered,
  onVizRendered,
  pluginManager,
  tokens as pluginServices,
  useServiceLocator,
} from './components/plugins';
export type * from './components/plugins';
export type { IServiceLocator } from './components/plugins';
export { type IPanelAddon, type IPanelAddonRenderProps } from './types/plugin';
