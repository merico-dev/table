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

export interface IFilterConfig_TextInput {
  required?: boolean;
}

export interface IDashboardFilter {
  key: string;
  label: string;
  type: 'select' | 'text-input' | 'checkbox' | 'date-time';
  default_value: any;
  config: IFilterConfig_Select | IFilterConfig_TextInput;
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
    } as IFilterConfig_Select,
  },
  {
    key: 'title_keyword',
    label: 'Title Keyword',
    type: 'text-input',
    default_value: '',
    config: {
      required: false,
    } as IFilterConfig_TextInput,
  },
]