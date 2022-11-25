import { cast, Instance, types } from 'mobx-state-tree';
import { FilterConfigModel_BaseSelect } from './select-base';

export const FilterConfigModel_MultiSelect = types
  .compose(
    'FilterConfigModel_MultiSelect',
    types.model({
      _name: 'multi-select',
      default_value: types.optional(types.array(types.string), []),
    }),
    FilterConfigModel_BaseSelect,
  )
  .actions((self) => ({
    setDefaultValue(default_value: string[]) {
      self.default_value = cast(default_value);
    },
  }));

export type IFilterConfig_MultiSelect = Instance<typeof FilterConfigModel_MultiSelect>;

export const createFilterConfig_MultiSelect = () =>
  FilterConfigModel_MultiSelect.create({
    _name: 'multi-select',
    default_value: [],
    static_options: [],
    options_query_id: '',
    select_first_by_default: false,
  });
