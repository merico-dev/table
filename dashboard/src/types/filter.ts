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
  multiple: false;
  default_value: string;
  static_options: IDashboardFilterOption[];
  options_query: IDashboardFilterOptionQuery;
}

export interface IFilterConfig_TextInput {
  required?: boolean;
  default_value: string;
}

export interface IFilterConfig_DateRange {
  inputFormat: 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD';
  clearable: boolean;
}

export interface IFilterConfig_Checkbox {
  default_value: boolean;
}

export interface IDashboardFilter {
  key: string;
  label: string;
  type: 'select' | 'text-input' | 'checkbox' | 'date-range';
  default_value: any;
  config: IFilterConfig_Select | IFilterConfig_TextInput | IFilterConfig_DateRange | IFilterConfig_Checkbox;
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
      ],
      options_query: {
        type: 'postgresql',
        key: '',
        sql: '',
      }
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
    type: 'date-range',
    default_value: '',
    config: {
      inputFormat: 'YYYY-MM-DD',
      clearable: false,
    } as IFilterConfig_DateRange,
  },
  {
    key: 'main-branch-only',
    label: 'Main-branch-based PR only',
    type: 'checkbox',
    default_value: false,
    config: {
      default_value: false,
    } as IFilterConfig_Checkbox,
  },
  {
    key: 'jenkinsJobID',
    label: 'Jenkins Job',
    type: 'select',
    default_value: '',
    config: {
      default_value: '',
      multiple: false,
      static_options: [],
      options_query: {
        type: 'postgresql',
        key: 'lake',
        sql: `SELECT j.name AS label, j.id AS value
FROM builds AS b
  INNER JOIN jobs AS j
ON b.job_id = j.id
GROUP BY (j.id)
        `,
      }
    } as IFilterConfig_Select,
  },
]