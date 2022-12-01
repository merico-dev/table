import { Instance, types } from 'mobx-state-tree';
import { FilterConfigModel_BaseSelect } from './select-base';

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
    select_first_by_default: false,
  });
