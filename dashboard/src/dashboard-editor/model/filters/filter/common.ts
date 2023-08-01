import { Instance, types } from 'mobx-state-tree';
import { DataSourceType } from '~/model';

export enum DashboardFilterType {
  Select = 'select',
  MultiSelect = 'multi-select',
  TreeSelect = 'tree-select',
  TextInput = 'text-input',
  Checkbox = 'checkbox',
  DateRange = 'date-range',
}

export const FilterOptionQueryModel = types.model({
  type: types.enumeration('DataSourceType', [DataSourceType.Postgresql, DataSourceType.MySQL, DataSourceType.HTTP]),
  key: types.string,
  sql: types.string,
});

export type IFilterOptionQuery = Instance<typeof FilterOptionQueryModel>;
