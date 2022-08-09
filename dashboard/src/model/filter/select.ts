import { Instance, types } from 'mobx-state-tree';
import { FilterOptionQueryModel } from './common';

export const FilterConfigModel_SelectOption = types.model({
  label: types.string,
  value: types.string,
});

export type IFilterConfig_SelectOption = Instance<typeof FilterConfigModel_SelectOption>;

export const FilterConfigModel_Select = types.model('FilterConfigModel_Select', {
  required: types.boolean,
  default_value: types.string,
  static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
  options_query: FilterOptionQueryModel,
}).actions((self) => ({
  addStaticOption(option: IFilterConfig_SelectOption) {
    self.static_options.push(option)
  },
  removeStaticOption(index: number) {
    self.static_options.splice(index, 1)
  },
}));

export type IFilterConfig_Select = Instance<typeof FilterConfigModel_Select>;
