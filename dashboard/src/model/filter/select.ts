import { Instance, types } from "mobx-state-tree";
import { FilterOptionQueryModel } from "./common";

export const FilterConfigModel_SelectOption = types.model({
  label: types.string,
  value: types.string,
})

export const FilterConfigModel_Select = types.model('FilterConfigModel_Select', {
  required: types.boolean,
  default_value: types.string,
  static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
  options_query: FilterOptionQueryModel,
})

export type IFilterConfig_Select = Instance<typeof FilterConfigModel_Select>
