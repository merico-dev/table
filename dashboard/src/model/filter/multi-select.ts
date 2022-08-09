import { Instance, types, cast } from 'mobx-state-tree';
import { FilterOptionQueryModel, IFilterOptionQuery } from './common';
import { FilterConfigModel_SelectOption, IFilterConfig_SelectOption } from './select';

export const FilterConfigModel_MultiSelect = types
  .model('FilterConfigModel_MultiSelect', {
    default_value: types.optional(types.array(types.string), []),
    static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
    options_query: FilterOptionQueryModel,
  })
  .actions((self) => ({
    addStaticOption(option: { label: string, value: string }) {
      self.static_options.push(option);
    },
    removeStaticOption(index: number) {
      self.static_options.splice(index, 1);
    },
    setDefaultValue(default_value: string[]) {
      self.default_value = cast(default_value);
    },
    setOptionsQuery(options_query: IFilterOptionQuery) {
      self.options_query = options_query;
    },
  }));

export type IFilterConfig_MultiSelect = Instance<typeof FilterConfigModel_MultiSelect>;
