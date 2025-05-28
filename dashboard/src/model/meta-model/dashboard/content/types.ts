import { AnyObject, DashboardFilterType } from '~/types';
import { FilterMetaInstance } from './filter';
import { ComboboxItem, ComboboxItemGroup } from '@mantine/core';

export type TPayloadForSQL = {
  context: AnyObject;
  sql_snippets: AnyObject;
  global_sql_snippets: AnyObject;
  filters: AnyObject;
};

export type DashboardStateVariableOptions = {
  optionGroups: Array<ComboboxItemGroup<ComboboxItem>>;
  validValues: Set<string>;
};

export type TDashboardStateValues = {
  filters: AnyObject;
  context: AnyObject;
};

export type TDashboardStateItem_Context = {
  type: 'context';
  key: string;
  value: any;
};

export type TDashboardStateItem_Filter = {
  type: DashboardFilterType;
  key: string;
  model: FilterMetaInstance;
  label: string;
  value: any;
};
export type TDashboardStateItem = TDashboardStateItem_Context | TDashboardStateItem_Filter;

export type TDashboardState = {
  filters: Record<string, TDashboardStateItem>;
  context: Record<string, TDashboardStateItem>;
};
export type TPayloadForSQLSnippet = Omit<TPayloadForSQL, 'sql_snippets' | 'global_sql_snippets'>;
export type TPayloadForViz = Omit<TPayloadForSQL, 'sql_snippets' | 'global_sql_snippets'>;
