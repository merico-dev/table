import { cast, Instance, types } from 'mobx-state-tree';
import { FilterConfigModel_BaseSelect } from './select-base';

export const FilterConfigModel_TreeSelect = types
  .compose(
    'FilterConfigModel_TreeSelect',
    types.model({
      _name: types.literal('tree-select'),
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

export type IFilterConfig_TreeSelect = Instance<typeof FilterConfigModel_TreeSelect>;

export const createFilterConfig_TreeSelect = () =>
  FilterConfigModel_TreeSelect.create({
    _name: 'tree-select',
    default_value: [],
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
