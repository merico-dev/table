import { Instance, types } from 'mobx-state-tree';
import { DataSourceType } from '~/model/queries/types';
import { FilterConfigModel_BaseSelect } from './select-base';

export const FilterConfigModel_Select = types
  .compose(
    'FilterConfigModel_Select',
    types.model({
      default_value: types.string,
      required: types.boolean,
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
  }));

export type IFilterConfig_Select = Instance<typeof FilterConfigModel_Select>;

export const createFilterConfig_Select = () =>
  FilterConfigModel_Select.create({
    required: false,
    default_value: '',
    static_options: [],
    options_query: {
      type: DataSourceType.Postgresql,
      key: '',
      sql: '',
    },
    select_first_by_default: false,
  });
