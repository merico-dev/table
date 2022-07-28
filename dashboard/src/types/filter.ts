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
  label: string;
  type: 'select' | 'input' | 'checkbox' | 'date-time';
  default_value: any;
  config: IFilterConfig_Select | IFilterConfig_Input;
}

export const mockFilters: IDashboardFilter[] = [
  {
    key: 'date_format',
    label: 'Date Format',
    type: 'select',
    default_value: 'yyyy-mm-dd',
    config: {
      multiple: true,
      static_options: [
        {
          label: 'yyyy-mm-dd',
          value: 'yyyy-mm-dd',
        },
        {
          label: 'yyyy-mm',
          value: 'yyyy-mm',
        },
        {
          label: 'yyyy',
          value: 'yyyy',
        },
      ]
    } as IFilterConfig_Select
  }
]