import { Instance, types, cast } from 'mobx-state-tree';
import { FilterOptionQueryModel, IFilterOptionQuery } from './common';

export const FilterConfigModel_SelectOption = types
  .model({
    label: types.string,
    value: types.string,
  })
  .actions((self) => ({
    setLabel(label: string) {
      self.label = label;
    },
    setValue(value: string) {
      self.value = value;
    },
  }));

export type IFilterConfig_SelectOption = Instance<typeof FilterConfigModel_SelectOption>;

export const FilterConfigModel_Select = types
  .model('FilterConfigModel_Select', {
    required: types.boolean,
    default_value: types.string,
    static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
    options_query: FilterOptionQueryModel,
  })
  .actions((self) => ({
    addStaticOption(option: { label: string; value: string }) {
      self.static_options.push(option);
    },
    removeStaticOption(index: number) {
      self.static_options.splice(index, 1);
    },
    setRequired(required: boolean) {
      self.required = required;
    },
    setDefaultValue(default_value: string) {
      self.default_value = default_value;
    },
    setOptionsQuery(options_query: IFilterOptionQuery) {
      self.options_query = options_query;
    },
  }));

export type IFilterConfig_Select = Instance<typeof FilterConfigModel_Select>;
