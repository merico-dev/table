import { AnyObject, DashboardFilterType } from '~/types';

export type TPayloadForSQL = {
  context: AnyObject;
  sql_snippets: AnyObject;
  global_sql_snippets: AnyObject;
  filters: AnyObject;
};
export type TDashboardStateValues = {
  filters: AnyObject;
  context: AnyObject;
};
export type TDashboardStateItem = {
  type: DashboardFilterType | 'context';
  key: string;
  label: string;
  value: any;
  string: string;
};
export type TDashboardState = {
  filters: Record<string, TDashboardStateItem>;
  context: Record<string, TDashboardStateItem>;
};
export type TPayloadForSQLSnippet = Omit<TPayloadForSQL, 'sql_snippets' | 'global_sql_snippets'>;
export type TPayloadForViz = Omit<TPayloadForSQL, 'sql_snippets' | 'global_sql_snippets'>;
