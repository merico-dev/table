import { AnyObject } from '~/types';

export type TPayloadForSQL = {
  context: AnyObject;
  sql_snippets: AnyObject;
  global_sql_snippets: AnyObject;
  filters: AnyObject;
};
export type TDashboardState = {
  filters: AnyObject;
  context: AnyObject;
};
export type TPayloadForSQLSnippet = Omit<TPayloadForSQL, 'sql_snippets' | 'global_sql_snippets'>;
export type TPayloadForViz = Omit<TPayloadForSQL, 'sql_snippets' | 'global_sql_snippets'>;
