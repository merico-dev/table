import { Instance, types } from 'mobx-state-tree';

export const FilterConfigModel_Checkbox = types
  .model('FilterConfigModel_Checkbox', {
    default_value: types.boolean,
  })
  .actions((self) => ({
    setDefaultValue(default_value: boolean) {
      self.default_value = default_value;
    },
  }));

export type IFilterConfig_Checkbox = Instance<typeof FilterConfigModel_Checkbox>;

export const createFilterConfig_Checkbox = () =>
  FilterConfigModel_Checkbox.create({
    default_value: false,
  });
