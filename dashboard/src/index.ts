export const getVersion = () =>
  import('../package.json').then(({ version }) => {
    console.log(`[@devtable/dashboard] version: ${version}`);
    return version;
  });

export * from './dashboard-editor';
export * from './dashboard-render';
export * from './components/view';
export * from './components/panel';
export * from './contexts';
export * from './types';
export * from './model';

import './init-dayjs';

// NOTE: keep it align with global.d.ts
export interface IDashboardConfig {
  basename: string;
  apiBaseURL: string;
  makeQueryENV?: () => Record<string, any>;
  app_id?: string;
  app_secret?: string;
  monacoPath: string;
}
