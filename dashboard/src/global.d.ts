// eslint-disable-next-line @typescript-eslint/no-explicit-any
type $TSFixMe = any;

interface IDashboardConfig {
  basename: string;
  apiBaseURL: string;
  makeQueryENV?: () => Record<string, any>;
  app_id?: string;
  app_secret?: string;
  monacoPath: string;
}

type TFunctionString = string;

type TPanelData = Record<string, TQueryData>;
type TQueryData = Record<string, any>[];
type TDataKey = string; // queryID.columnKey
