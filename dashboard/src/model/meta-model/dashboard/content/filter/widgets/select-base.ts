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
    get optionsLoading() {
      if (!self.usingQuery) {
        return false;
      }
      const { state } = self.contentModel.getDataStuffByID(self.options_query_id);
      return state === 'loading';
    },
    get options(): TSelectOption[] {
      if (!self.usingQuery) {
        return self.static_options;
      }
      const { data, state } = self.contentModel.getDataStuffByID(self.options_query_id);
      if (state === 'error') {
        return [];
      }
      if (!Array.isArray(data)) {
        return [];
      }
      // return stale data if we have it
      return data.filter((d) => 'label' in d && 'value' in d);
    },
    get optionValuesSet(): Set<string> {
      return new Set(this.options.map((o) => o.value));
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
    setDefaultSelectionCount(v: string | number) {
      const n = Number(v);
      if (Number.isFinite(n)) {
        self.default_selection_count = n;
      }
    },
    setOptionsQueryID(id: string | null) {
      self.options_query_id = id ?? '';
    },
  }));

export type FilterBaseSelectConfigInstance = Instance<typeof FilterBaseSelectConfigMeta>;
