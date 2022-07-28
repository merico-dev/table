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
    key: 'repo_id',
    label: 'Repository',
    type: 'select',
    config: {
      multiple: true,
      static_options: [
        {
          label: 'Repo A',
          value: 'repo_a',
        },
        {
          label: 'Repo B',
          value: 'repo_b',
        },
        {
          label: 'Repo C',
          value: 'repo_c',
        },
      ]
    } as IFilterConfig_Select
  }
]