export interface IDashboardFilterOption {
  label: string;
  value: string;
}

export interface IDashboardFilterOptionQuery {
  type: 'postgresql',
  key: string;
  sql: string;
}

// FIXME: better naming?
export interface IFilterConfig_Select {
  required: boolean;
  default_value: string;
  static_options: IDashboardFilterOption[];
  options_query: IDashboardFilterOptionQuery;
}

export interface IFilterConfig_MultiSelect {
  default_value: string[];
  static_options: IDashboardFilterOption[];
  options_query: IDashboardFilterOptionQuery;
}

export interface IFilterConfig_TextInput {
  required: boolean;
  default_value: string;
}

export interface IFilterConfig_DateRange {
  inputFormat: 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD';
  clearable: boolean;
  required: boolean;
}

export interface IFilterConfig_Checkbox {
  default_value: boolean;
}

export interface IDashboardFilter {
  key: string;
  label: string;
  order: number;
  type: 'select' | 'multi-select' | 'text-input' | 'checkbox' | 'date-range';
  config: IFilterConfig_Select | IFilterConfig_MultiSelect | IFilterConfig_TextInput | IFilterConfig_DateRange | IFilterConfig_Checkbox;
}
