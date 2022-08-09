import { types } from "mobx-state-tree"

export enum DashboardFilterType {
  Select = 'select',
  MultiSelect = 'multi-select',
  TextInput = 'text-input',
  Checkbox = 'checkbox',
  DateRange = 'date-range',
}

export const FilterOptionQueryModel = types.model({
  type: types.enumeration('DataSourceType', ['postgresql']),
  key: types.string,
  sql: types.string,
})
