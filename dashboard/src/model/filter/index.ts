import { Instance, types } from 'mobx-state-tree';
import { FilterConfigModel_Select } from './select';
import { FilterConfigModel_MultiSelect } from './multi-select';
import { FilterConfigModel_Checkbox } from './checkbox';
import { FilterConfigModel_TextInput } from './text-input';
import { FilterConfigModel_DateRange } from './date-range';
import { DashboardFilterType } from './common';

export const FilterModel = types.model('FilterModel', {
  id: types.identifier,
  key: types.string,
  label: types.string,
  order: types.number,
  type: types.enumeration('DashboardFilterType', [
    DashboardFilterType.Select,
    DashboardFilterType.MultiSelect,
    DashboardFilterType.TextInput,
    DashboardFilterType.Checkbox,
    DashboardFilterType.DateRange,
  ]),
  config: types.union(
    FilterConfigModel_Select,
    FilterConfigModel_MultiSelect,
    FilterConfigModel_TextInput,
    FilterConfigModel_Checkbox,
    FilterConfigModel_DateRange,
  ),
});

export type FilterModelInstance = Instance<typeof FilterModel>;
