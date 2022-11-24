import { cast, Instance, types } from 'mobx-state-tree';
import { DataSourceType } from '~/model/queries/types';
import { FilterOptionQueryModel, IFilterOptionQuery } from './common';
import { FilterConfigModel_SelectOption } from './select';

export const FilterConfigModel_MultiSelect = types
  .model('FilterConfigModel_MultiSelect', {
    default_value: types.optional(types.array(types.string), []),
    static_options: types.optional(types.array(FilterConfigModel_SelectOption), []),
    options_query: FilterOptionQueryModel,
    select_first_by_default: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    addStaticOption(option: { label: string; value: string }) {
      self.static_options.push(option);
    },
    removeStaticOption(index: number) {
      self.static_options.splice(index, 1);
    },
    setDefaultValue(default_value: string[]) {
      self.default_value = cast(default_value);
    },
    setOptionsQuery(options_query: IFilterOptionQuery) {
      self.options_query = options_query;
    },
    setSelectFirstByDefault(v: boolean) {
      self.select_first_by_default = v;
    },
  }));

export type IFilterConfig_MultiSelect = Instance<typeof FilterConfigModel_MultiSelect>;

export const createFilterConfig_MultiSelect = () =>
  FilterConfigModel_MultiSelect.create({
    default_value: [],
    static_options: [],
    options_query: {
      type: DataSourceType.Postgresql,
      key: '',
      sql: '',
    },
    select_first_by_default: false,
  });
