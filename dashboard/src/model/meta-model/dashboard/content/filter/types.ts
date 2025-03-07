import { types } from 'mobx-state-tree';

export enum DashboardFilterType {
  Select = 'select',
  MultiSelect = 'multi-select',
  TreeSelect = 'tree-select',
  TreeSingleSelect = 'tree-single-select',
  TextInput = 'text-input',
  Checkbox = 'checkbox',
  DateRange = 'date-range',
}

export type DefaultValueMode = 'intersection' | 'reset';
export const DefaultValueModeModelType = types.optional(
  types.enumeration<DefaultValueMode>(['intersection', 'reset']),
  'intersection',
);
