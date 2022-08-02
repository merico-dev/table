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

export const mockFilters: IDashboardFilter[] = [
  {
    key: 'date_format',
    label: 'Charting Date Format',
    type: 'select',
    order: 2,
    config: {
      default_value: 'yyyy-mm-dd',
      required: true,
      static_options: [
        {
          label: '2022-01-01',
          value: 'yyyy-mm-dd',
        },
        {
          label: '2022-01',
          value: 'yyyy-mm',
        },
        {
          label: '2022',
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
    key: 'multi_select',
    label: 'Multi Select',
    order: 3,
    type: 'multi-select',
    config: {
      default_value: ['react', 'nextjs'],
      static_options: [
        {
          label: 'React',
          value: 'react',
        },
        {
          label: 'Next.js',
          value: 'nextjs',
        },
        {
          label: 'Svelte',
          value: 'svelte',
        },
      ],
      options_query: {
        type: 'postgresql',
        key: '',
        sql: '',
      }
    } as IFilterConfig_MultiSelect,
  },
  {
    key: 'title_keyword',
    label: 'Title Keyword',
    order: 1,
    type: 'text-input',
    config: {
      required: false,
      default_value: '',
    } as IFilterConfig_TextInput,
  },
  {
    key: 'date_range',
    label: 'Date Range',
    order: 1,
    type: 'date-range',
    config: {
      inputFormat: 'YYYY-MM-DD',
      clearable: false,
      required: false,
    } as IFilterConfig_DateRange,
  },
  {
    key: 'main-branch-only',
    label: 'Main-branch-based PR only',
    order: 5,
    type: 'checkbox',
    config: {
      default_value: false,
    } as IFilterConfig_Checkbox,
  },
  {
    key: 'jenkinsJobID',
    label: 'Jenkins Job',
    order: 4,
    type: 'select',
    config: {
      required: false,
      default_value: '',
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