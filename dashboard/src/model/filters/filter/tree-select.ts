import { cast, Instance, types } from 'mobx-state-tree';
import { FilterConfigModel_BaseSelect } from './select-base';

export const FilterConfigModel_TreeSelect = types
  .compose(
    'FilterConfigModel_TreeSelect',
    types.model({
      _name: types.literal('tree-select'),
      default_value: types.optional(types.array(types.string), []),
      min_width: types.optional(types.string, ''),
    }),
    FilterConfigModel_BaseSelect,
  )
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
