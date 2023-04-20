import { IDashboardConfig } from '@devtable/dashboard';
import { ISettingsFormConfig } from '@devtable/settings-form';

export const MonacoPath = import.meta.env.VITE_WEBSITE_BASE_URL + '/assets/monaco-editor/min/vs';

export const DashboardConfig: IDashboardConfig = {
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  basename: import.meta.env.VITE_WEBSITE_BASE_URL,
  monacoPath: MonacoPath,
};

export const SettingsFormConfig: ISettingsFormConfig = {
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  basename: import.meta.env.VITE_WEBSITE_BASE_URL,
  monacoPath: MonacoPath,
};
