import { Instance, types } from 'mobx-state-tree';
import { FilterOptionQueryModel } from './common';
import { FilterConfigModel_SelectOption } from './select';

export const FilterConfigModel_MultiSelect = types.model('FilterConfigModel_MultiSelect', {
  default_value: types.string,
  static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
  options_query: FilterOptionQueryModel,
});

export type IFilterConfig_MultiSelect = Instance<typeof FilterConfigModel_MultiSelect>;
