import { Instance, types } from "mobx-state-tree";

export const FilterConfigModel_Checkbox = types.model('FilterConfigModel_Checkbox', {
  default_value: types.string,
})

export type IFilterConfig_Checkbox = Instance<typeof FilterConfigModel_Checkbox>