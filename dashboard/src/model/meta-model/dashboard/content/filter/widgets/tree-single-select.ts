import { reaction, toJS } from 'mobx';
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
      if (self.treeDataLoading) {
        return '';
      }
      const v = self.filter.formattedDefaultValue;
      if (v) {
        return v;
      }

      if (this.selectFirstByDefault && self.treeData.length > 0) {
        return self.treeData[0].value;
      }
      return '';
    },
    valueObject(value: string | null) {
      if (!value) {
        return undefined;
      }
      return self.plainData.find((d: any) => d.value === value);
    },
    initialSelection(value: string | null) {
      if (!value) {
        return undefined;
      }

      return this.valueObject(value);
    },
    truthy(value: any) {
      return typeof value === 'string' && value !== '';
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: string) {
      self.default_value = default_value;
    },
    applyDefaultSelection() {
      if (self.treeDataLoading) {
        return;
      }

      if (self.default_value_mode === 'reset') {
        self.filter.setValue(self.defaultSelection);
        return;
      }

      const currentSelection = self.filter.value;
      if (self.optionValuesSet.has(currentSelection)) {
        self.filter.setValue(currentSelection);
      } else {
        self.filter.setValue(self.defaultSelection);
      }
    },
    afterCreate() {
      addDisposer(
        self,
        reaction(() => toJS(self.defaultSelection), this.applyDefaultSelection, {
          fireImmediately: false,
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
