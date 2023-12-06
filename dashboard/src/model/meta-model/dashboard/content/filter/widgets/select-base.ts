import { Instance, getParent, getRoot, types } from 'mobx-state-tree';

export type TSelectOption = {
  label: string;
  value: string;
  description?: string;
};

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

export type IFilterSelectConfigMetaOption = Instance<typeof FilterConfigModel_SelectOption>;

export const FilterBaseSelectConfigMeta = types
  .model('FilterConfigModel_BaseSelect', {
    static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
    options_query_id: types.optional(types.string, ''),
    default_selection_count: types.optional(types.number, 0),
    required: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get contentModel(): any {
      // @ts-expect-error typeof getRoot
      return getRoot(self).content;
    },
    get filter(): any {
      return getParent(self);
    },
    get usingQuery() {
      return !!self.options_query_id;
    },
  }))
  .views((self) => ({
    get options(): TSelectOption[] {
      if (!self.usingQuery) {
        return self.static_options;
      }
      const { data, state, error } = self.contentModel.getDataStuffByID(self.options_query_id);
      if (state === 'idle') {
        return Array.isArray(data) ? data : [];
      }
      return [];
    },
  }))
  .actions((self) => ({
    setRequired(required: boolean) {
      self.required = required;
    },
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

export type FilterBaseSelectConfigInstance = Instance<typeof FilterBaseSelectConfigMeta>;
