import { Instance, types } from 'mobx-state-tree';
import { FilterBaseSelectConfigMeta } from './select-base';
import { shallowToJS } from '~/utils/shallow-to-js';

export const FilterSelectConfigMeta = types
  .compose(
    'FilterConfigModel_Select',
    types.model({
      _name: types.literal('select'),
      default_value: types.string,
      required: types.boolean,
      width: types.optional(types.string, ''),
    }),
    FilterBaseSelectConfigMeta,
  )
  .views((self) => ({
    get json() {
      const { _name, default_value, required, width, static_options, options_query_id, default_selection_count } = self;
      return shallowToJS({
        _name,
        width,
        required,
        default_value,
        static_options,
        options_query_id,
        default_selection_count,
      });
    },
    truthy(value: any) {
      return !!value;
    },
    getSelectOption(value: string) {
      return self.options.find((o) => o.value === value);
    },
  }))
  .actions((self) => ({
    setRequired(required: boolean) {
      self.required = required;
    },
    setDefaultValue(default_value: string) {
      self.default_value = default_value;
    },
    setWidth(v: string) {
      self.width = v;
    },
  }));

export type FilterSelectConfigInstance = Instance<typeof FilterSelectConfigMeta>;

export const createFilterSelectConfig = () =>
  FilterSelectConfigMeta.create({
    _name: 'select',
    required: false,
    default_value: '',
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
