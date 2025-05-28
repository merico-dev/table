import { reaction, toJS, type IObservableArray } from 'mobx';
import { addDisposer, cast, Instance, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import {
  FilterBaseSelectConfigMeta,
  TSelectOption,
  type IFilterBaseSelectConfigInstance,
  type IFilterConfigModel_SelectOption,
} from './select-base';
import { DefaultValueModeModelType, type DefaultValueMode } from '../types';
import { typeAssert } from '~/types/utils';

export const FilterMultiSelectConfigMeta = types
  .compose(
    'FilterMultiSelectConfigMeta',
    types.model({
      _name: types.literal('multi-select'),
      min_width: types.optional(types.string, ''),
      default_value: types.optional(types.array(types.string), []),
      default_value_mode: DefaultValueModeModelType,
    }),
    FilterBaseSelectConfigMeta,
  )
  .views((self) => ({
    get json() {
      const {
        _name,
        default_value,
        default_value_mode,
        required,
        min_width,
        static_options,
        options_query_id,
        default_selection_count,
      } = self;
      return shallowToJS({
        _name,
        required: !!required,
        min_width,
        default_value,
        static_options,
        options_query_id,
        default_value_mode,
        default_selection_count,
      });
    },
    get defaultSelection() {
      const defaultValue = self.filter.formattedDefaultValue;
      if (Array.isArray(defaultValue) && defaultValue.length > 0) {
        return defaultValue;
      }
      if (!self.usingQuery) {
        return defaultValue;
      }

      return self.options.slice(0, self.default_selection_count).map((o: any) => o.value);
    },
    optionsByValues(value: any) {
      if (!Array.isArray(value) || value.length === 0) {
        return [];
      }
      const set = new Set(value);
      return self.options.filter((o: any) => set.has(o.value));
    },
    initialSelection(value: string[] | null) {
      if (!value) {
        return this.defaultSelection;
      }
      return value;
    },
    truthy(value: any) {
      return Array.isArray(value) && value.length > 0;
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: string[]) {
      self.default_value = cast(default_value);
    },
    setDefaultValueMode(v: string | null) {
      if (v !== 'intersect' && v !== 'reset') {
        return;
      }
      self.default_value_mode = v;
    },
    setMinWidth(v: string) {
      self.min_width = v;
    },
    applyDefaultSelection() {
      if (self.optionsLoading) {
        return;
      }

      if (self.default_value_mode === 'reset') {
        self.filter.setValue(self.defaultSelection);
        return;
      }

      const options = new Set(self.options.map((o: any) => o.value));
      const currentValue = self.filter.value ?? [];
      const validValues = currentValue.filter((v: any) => options.has(v));
      if (validValues.length > 0) {
        self.filter.setValue(validValues);
      } else {
        self.filter.setValue(self.defaultSelection);
      }
    },
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => toJS(self.defaultSelection), self.applyDefaultSelection, {
          fireImmediately: false,
          delay: 0,
        }),
      );
    },
  }));

export type FilterMultiSelectConfigInstance = Instance<typeof FilterMultiSelectConfigMeta>;

export interface IFilterMultiSelectConfig extends IFilterBaseSelectConfigInstance {
  // Properties
  _name: 'multi-select';
  default_value: IObservableArray<string>;
  default_value_mode: 'intersect' | 'reset';
  min_width: string;

  // Views
  readonly json: {
    _name: 'multi-select';
    required: boolean;
    min_width: string;
    default_value: IObservableArray<string>;
    static_options: IObservableArray<IFilterConfigModel_SelectOption>;
    options_query_id: string;
    default_value_mode: DefaultValueMode;
    default_selection_count: number;
  };
  readonly defaultSelection: string[];
  optionsByValues(value: any): TSelectOption[];
  initialSelection(value: string[] | null): string[];
  truthy(value: unknown): boolean;

  // Actions
  setDefaultValue(default_value: string[]): void;
  setDefaultValueMode(v: string | null): void;
  setMinWidth(v: string): void;
  applyDefaultSelection(): void;
  afterCreate(): void;
}

typeAssert.shouldExtends<IFilterMultiSelectConfig, FilterMultiSelectConfigInstance>();

export const createFilterMultiSelectConfig = () =>
  FilterMultiSelectConfigMeta.create({
    _name: 'multi-select',
    default_value: [],
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
