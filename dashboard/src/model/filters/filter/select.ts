import { Instance, types } from 'mobx-state-tree';
import { FilterConfigModel_BaseSelect } from './select-base';
import { shallowToJS } from '~/utils/shallow-to-js';

export const FilterConfigModel_Select = types
  .compose(
    'FilterConfigModel_Select',
    types.model({
      _name: types.literal('select'),
      default_value: types.string,
      required: types.boolean,
      width: types.optional(types.string, ''),
    }),
    FilterConfigModel_BaseSelect,
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

export type IFilterConfig_Select = Instance<typeof FilterConfigModel_Select>;

export const createFilterConfig_Select = () =>
  FilterConfigModel_Select.create({
    _name: 'select',
    required: false,
    default_value: '',
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
