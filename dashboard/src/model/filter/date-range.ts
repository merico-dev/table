import { Instance, types } from 'mobx-state-tree';

export const FilterConfigModel_DateRange = types.model('FilterConfigModel_DateRange', {
  required: types.boolean,
  inputFormat: types.enumeration('DateRangeInputFormat', ['YYYY', 'YYYY-MM', 'YYYY-MM-DD']),
  clearable: types.boolean,
});

export type IFilterConfig_DateRange = Instance<typeof FilterConfigModel_DateRange>;
