import { IDashboardConfig } from '@devtable/dashboard';
import { ISettingsFormConfig } from '@devtable/settings-form';

export const DashboardConfig: IDashboardConfig = {
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  basename: import.meta.env.VITE_WEBSITE_BASE_URL,
  monacoPath: import.meta.env.VITE_WEBSITE_BASE_URL + '/assets/monaco-editor/min/vs',
};

export const SettingsFormConfig: ISettingsFormConfig = {
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  basename: import.meta.env.VITE_WEBSITE_BASE_URL,
  monacoPath: import.meta.env.VITE_WEBSITE_BASE_URL + '/assets/monaco-editor/min/vs',
};
