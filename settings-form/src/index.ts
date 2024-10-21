export const getVersion = () =>
  import('../package.json').then(({ version }) => {
    console.log(`[@devtable/settings-form] version: ${version}`);
    return version;
  });

export * from './datasource';
export * from './account';
export * from './api-key';
export * from './sql_snippet';
export {
  FacadeApiClient,
  DefaultApiClient,
  facadeApiClient,
  APIClient,
  configureAPIClient,
} from './api-caller/request';
export type { IAPIClient, IAPIClientRequestOptions } from './api-caller/request';

export * from './api-caller/account.typed';
export * from './api-caller/api-key.typed';
export * from './api-caller/datasource.typed';
export * from './api-caller/role.typed';
export * from './api-caller/sql_snippet.typed';

// NOTE: keep it align with global.d.ts
export interface ISettingsFormConfig {
  basename: string;
  apiBaseURL: string;
  app_id?: string;
  app_secret?: string;
  monacoPath: string;
}
