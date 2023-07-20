import { Instance, getRoot, types } from 'mobx-state-tree';

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
    default_selection_count: types.optional(types.number, 0),
  })
  .views((self) => ({
    get usingQuery() {
      return !!self.options_query_id;
    },
  }))
  .views((self) => ({
    get options() {
      if (!self.usingQuery) {
        return self.static_options;
      }
      // @ts-expect-error untyped getRoot(self)
      const { data, state, error } = getRoot(self).content.getDataStuffByID(self.options_query_id);
      if (state === 'idle') {
        return data;
      }
      return [];
    },
  }))
  .actions((self) => ({
    addStaticOption(option: { label: string; value: string }) {
      self.static_options.push(option);
    },
    removeStaticOption(index: number) {
      self.static_options.splice(index, 1);
    },
    setDefaultSelectionCount(v: number) {
      self.default_selection_count = v;
    },
    setOptionsQueryID(id: string | null) {
      self.options_query_id = id ?? '';
    },
  }));

export type IFilterConfig_BaseSelect = Instance<typeof FilterConfigModel_BaseSelect>;
