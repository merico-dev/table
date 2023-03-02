import { cast, Instance, types } from 'mobx-state-tree';
import { FilterConfigModel_BaseSelect } from './select-base';

export const FilterConfigModel_MultiSelect = types
  .compose(
    'FilterConfigModel_MultiSelect',
    types.model({
      _name: types.literal('multi-select'),
      min_width: types.optional(types.string, ''),
      default_value: types.optional(types.array(types.string), []),
    }),
    FilterConfigModel_BaseSelect,
  )
  .views((self) => ({
    get json() {
      const { _name, default_value, min_width, static_options, options_query_id, default_selection_count } = self;
      return {
        _name,
        min_width,
        default_value,
        static_options,
        options_query_id,
        default_selection_count,
      };
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: string[]) {
      self.default_value = cast(default_value);
    },
    setMinWidth(v: string) {
      self.min_width = v;
    },
  }));

export type IFilterConfig_MultiSelect = Instance<typeof FilterConfigModel_MultiSelect>;

export const createFilterConfig_MultiSelect = () =>
  FilterConfigModel_MultiSelect.create({
    _name: 'multi-select',
    default_value: [],
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
