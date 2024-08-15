import { reaction } from 'mobx';
import { addDisposer, Instance, types } from 'mobx-state-tree';
import { FilterBaseTreeSelectConfigMeta } from './tree-select-base';

export const FilterTreeSingleSelectConfigMeta = types
  .compose(
    'FilterTreeSingleSelectConfigMeta',
    types.model({
      _name: types.literal('tree-single-select'),
      default_value: types.optional(types.string, ''),
    }),
    FilterBaseTreeSelectConfigMeta,
  )
  .views((self) => ({
    get json() {
      const { _name, default_value, required, min_width, static_options, options_query_id, default_selection_count } =
        self;
      return {
        _name,
        required: !!required,
        min_width,
        default_value,
        static_options,
        options_query_id,
        default_selection_count,
      };
    },
    get selectFirstByDefault() {
      return self.default_selection_count === 1;
    },
    get defaultSelection() {
      if (this.selectFirstByDefault && self.treeData.length > 0) {
        return self.treeData[0].value;
      }
      return self.filter.formattedDefaultValue;
    },
    valueObject(value: string) {
      return self.plainData.find((d: any) => d.value === value);
    },
    initialSelection(value: string | null) {
      if (!value) {
        return this.valueObject(this.defaultSelection);
      }
      return this.valueObject(value);
    },
    truthy(value: any) {
      return Array.isArray(value) && value.length > 0;
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: string) {
      self.default_value = default_value;
    },
    applyDefaultSelection() {
      const currentSelection = self.filter.value;
      const options = new Set(self.plainData.map((o: any) => o.value));
      const validValues = (currentSelection ?? []).filter((v: any) => options.has(v));
      if (validValues.length > 0) {
        self.filter.setValue(validValues);
      } else {
        self.filter.setValue(self.defaultSelection);
      }
    },
    afterCreate() {
      addDisposer(
        self,
        reaction(() => JSON.stringify(self.defaultSelection), this.applyDefaultSelection, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));

export type FilterTreeSingleSelectConfigInstance = Instance<typeof FilterTreeSingleSelectConfigMeta>;

export const createFilterTreeSingleSelectConfig = () =>
  FilterTreeSingleSelectConfigMeta.create({
    _name: 'tree-single-select',
    default_value: '',
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
