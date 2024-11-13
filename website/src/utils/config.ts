import { IDashboardConfig } from '@devtable/dashboard';
import { ISettingsFormConfig } from '@devtable/settings-form';
import { APICaller } from '../api-caller';

const joinPath = (a: string, b: string) => {
  return (a + b).replace(/\/\//, '/');
};
export const MonacoPath = new URL(
  joinPath(import.meta.env.VITE_WEBSITE_BASE_URL, '/assets/monaco-editor/min/vs'),
  window.location.origin,
).toString();

export const BaseDashboardConfig: IDashboardConfig = {
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  basename: import.meta.env.VITE_WEBSITE_BASE_URL,
  monacoPath: MonacoPath,
  makeQueryENV: () => ({}),
  searchButtonProps: {},
};

export const getDashboardConfig = async (signal: AbortSignal): Promise<IDashboardConfig> => {
  try {
    const makeQueryENV = await APICaller.custom_function.get('makeQueryENV', signal)();
    return {
      ...BaseDashboardConfig,
      makeQueryENV: makeQueryENV ?? undefined,
    };
  } catch (error) {
    return BaseDashboardConfig;
  }
};

export const SettingsFormConfig: ISettingsFormConfig = {
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  basename: import.meta.env.VITE_WEBSITE_BASE_URL,
  monacoPath: MonacoPath,
};
