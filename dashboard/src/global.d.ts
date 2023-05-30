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

type TVizData = Record<string, $TSFixMe>[];
