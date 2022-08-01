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
  multiple: false;
  default_value: string;
  static_options: IDashboardFilterOption[];
  options_query: IDashboardFilterOptionQuery;
}

export interface IFilterConfig_TextInput {
  required?: boolean;
  default_value: string;
}

export interface IFilterConfig_DateTime {
  inputFormat: 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD';
  clearable: boolean;
}

export interface IFilterConfig_Checkbox {
  default_value: boolean;
}

export interface IDashboardFilter {
  key: string;
  label: string;
  type: 'select' | 'text-input' | 'checkbox' | 'date-time';
  default_value: any;
  config: IFilterConfig_Select | IFilterConfig_TextInput | IFilterConfig_DateTime | IFilterConfig_Checkbox;
}

export const mockFilters: IDashboardFilter[] = [
  {
    key: 'date_format',
    label: 'Date Format',
    type: 'select',
    default_value: 'yyyy-mm-dd',
    config: {
      default_value: 'yyyy-mm-dd',
      multiple: false,
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
      default_value: '',
    } as IFilterConfig_TextInput,
  },
  {
    key: 'date_range',
    label: 'Date Range',
    type: 'date-time',
    default_value: '',
    config: {
      inputFormat: 'YYYY-MM-DD',
      clearable: false,
    } as IFilterConfig_DateTime,
  },
  {
    key: 'main-branch-only',
    label: 'Main-branch-based PR only',
    type: 'checkbox',
    default_value: false,
    config: {
    } as IFilterConfig_Checkbox,
  },
]