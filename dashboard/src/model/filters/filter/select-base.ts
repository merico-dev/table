import { Instance, types } from 'mobx-state-tree';

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

export const FilterConfigModel_BaseSelect = types
  .model('FilterConfigModel_BaseSelect', {
    static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
    options_query_id: types.optional(types.string, ''),
    select_first_by_default: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    addStaticOption(option: { label: string; value: string }) {
      self.static_options.push(option);
    },
    removeStaticOption(index: number) {
      self.static_options.splice(index, 1);
    },
    setSelectFirstByDefault(v: boolean) {
      self.select_first_by_default = v;
    },
    setOptionsQueryID(id: string) {
      self.options_query_id = id;
    },
  }));

export type IFilterConfig_BaseSelect = Instance<typeof FilterConfigModel_BaseSelect>;
