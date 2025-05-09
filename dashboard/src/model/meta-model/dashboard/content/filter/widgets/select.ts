import { reaction, toJS, type IObservableArray } from 'mobx';
import { addDisposer, Instance, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import {
  FilterBaseSelectConfigMeta,
  type IFilterBaseSelectConfigInstance,
  type IFilterConfigModel_SelectOption,
  type TSelectOption,
} from './select-base';
import { typeAssert } from '~/types/utils';

export const FilterSelectConfigMeta = types
  .compose(
    'FilterConfigModel_Select',
    types.model({
      _name: types.literal('select'),
      default_value: types.string,
      width: types.optional(types.string, ''),
      clearable: types.optional(types.boolean, false),
    }),
    FilterBaseSelectConfigMeta,
  )
  .views((self) => ({
    get json() {
      const {
        _name,
        clearable,
        default_value,
        required,
        width,
        static_options,
        options_query_id,
        default_selection_count,
      } = self;
      return shallowToJS({
        _name,
        width,
        required,
        clearable,
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
    get default_selection() {
      if (!self.usingQuery) {
        return self.filter.formattedDefaultValue;
      }
      if (self.default_selection_count > 0 && self.options.length > 0) {
        return self.options[0].value;
      }
      return '';
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: string | null) {
      if (default_value === null) {
        return;
      }

      self.default_value = default_value;
    },
    setWidth(v: string) {
      self.width = v;
    },
    setClearable(v: boolean) {
      self.clearable = v;
    },
    setDefaultSelection() {
      const currentValue = self.filter.value;
      const validValue = self.options.find((o) => o.value === currentValue)?.value;
      if (validValue) {
        self.filter.setValue(validValue);
      } else {
        self.filter.setValue(self.default_selection);
      }
    },
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => toJS(self.default_selection), self.setDefaultSelection, {
          fireImmediately: false,
          delay: 0,
        }),
      );
    },
  }));

export type FilterSelectConfigInstance = Instance<typeof FilterSelectConfigMeta>;

export interface IFilterSelectConfig extends IFilterBaseSelectConfigInstance {
  // Properties
  _name: 'select';
  default_value: string;
  width: string;
  clearable: boolean;

  // Views
  readonly json: {
    _name: 'select';
    width: string;
    required: boolean;
    clearable: boolean;
    default_value: string;
    static_options: IObservableArray<IFilterConfigModel_SelectOption>;
    options_query_id: string;
    default_selection_count: number;
  };
  readonly default_selection: string | undefined;
  truthy(value: unknown): boolean;
  getSelectOption(value: string): TSelectOption | undefined;

  // Actions
  setDefaultValue(default_value: string | null): void;
  setWidth(v: string): void;
  setClearable(v: boolean): void;
  setDefaultSelection(): void;
  afterCreate(): void;
}

typeAssert.shouldExtends<IFilterSelectConfig, FilterSelectConfigInstance>();

export const createFilterSelectConfig = () =>
  FilterSelectConfigMeta.create({
    _name: 'select',
    required: false,
    default_value: '',
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
