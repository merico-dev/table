import { Instance, types } from 'mobx-state-tree';

export const FilterConfigModel_DateRange = types
  .model('FilterConfigModel_DateRange', {
    required: types.boolean,
    inputFormat: types.enumeration('DateRangeInputFormat', ['YYYY', 'YYYY-MM', 'YYYY-MM-DD']),
    clearable: types.boolean,
  })
  .actions((self) => ({
    setRequired(required: boolean) {
      self.required = required;
    },
    setClearable(clearable: boolean) {
      self.clearable = clearable;
    },
    setInputFormat(inputFormat: string) {
      self.inputFormat = inputFormat;
    },
  }));

export type IFilterConfig_DateRange = Instance<typeof FilterConfigModel_DateRange>;
