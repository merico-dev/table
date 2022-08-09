import { Instance, types } from 'mobx-state-tree';
import { FilterOptionQueryModel } from './common';
import { FilterConfigModel_SelectOption, IFilterConfig_SelectOption } from './select';

export const FilterConfigModel_MultiSelect = types
  .model('FilterConfigModel_MultiSelect', {
    default_value: types.optional(types.array(types.string), []),
    static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
    options_query: FilterOptionQueryModel,
  })
  .actions((self) => ({
    addStaticOption(option: IFilterConfig_SelectOption) {
      self.static_options.push(option);
    },
    removeStaticOption(index: number) {
      self.static_options.splice(index, 1);
    },
  }));

export type IFilterConfig_MultiSelect = Instance<typeof FilterConfigModel_MultiSelect>;
