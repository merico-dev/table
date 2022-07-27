export interface IDashboardFilterOption {
  label: string;
  value: string;
}

export interface IDashboardFilterOptionQuery {
  type: 'postgresql',
  sql: string;
}

// FIXME: better naming?
export interface IFilterConfig_Select {
  multiple: boolean;
  static_options: IDashboardFilterOption[];
  options_query: IDashboardFilterOptionQuery;
}

export interface IFilterConfig_Input {
}

export interface IDashboardFilter {
  key: string;
  name: string;
  type: 'select' | 'input' | 'checkbox' | 'date-time';
  config: IFilterConfig_Select | IFilterConfig_Input;
}