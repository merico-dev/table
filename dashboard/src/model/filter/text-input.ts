import { Instance, types } from "mobx-state-tree";

export const FilterConfigModel_TextInput = types.model('FilterConfigModel_TextInput', {
  required: types.boolean,
  default_value: types.string,
})

export type IFilterConfig_TextInput = Instance<typeof FilterConfigModel_TextInput>
