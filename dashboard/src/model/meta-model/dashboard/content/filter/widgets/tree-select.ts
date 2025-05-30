import { reaction, type IObservableArray } from 'mobx';
import { addDisposer, cast, Instance, types } from 'mobx-state-tree';
import { FilterBaseTreeSelectConfigMeta, type IFilterBaseTreeSelectConfigInstance } from './tree-select-base';
import { typeAssert } from '~/types/utils';
import type { IFilterConfigModel_SelectOption, TSelectOption } from './select-base';

export const FilterTreeSelectConfigMeta = types
  .compose(
    'FilterTreeSelectConfigMeta',
    types.model({
      _name: types.literal('tree-select'),
      default_value: types.optional(types.array(types.string), []),
      treeCheckStrictly: types.optional(types.boolean, false),
    }),
    FilterBaseTreeSelectConfigMeta,
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
        treeCheckStrictly,
      } = self;
      return {
        _name,
        required: !!required,
        min_width,
        default_value,
        static_options,
        options_query_id,
        treeCheckStrictly,
        default_value_mode,
        default_selection_count,
      };
    },
    get defaultSelection() {
      const defaultValue = self.filter.formattedDefaultValue;
      if (Array.isArray(defaultValue) && defaultValue.length > 0) {
        return defaultValue;
      }

      const { default_selection_count } = self;
      if (!default_selection_count) {
        return [];
      }
      const treeData = self.treeData;
      return treeData.slice(0, default_selection_count).map((o) => o.value);
    },
    optionsByValues(value: any) {
      if (!Array.isArray(value) || value.length === 0) {
        return [];
      }
      const set = new Set(value);
      return self.options.filter((o: any) => set.has(o.value));
    },
    valueObjects(value: string[]) {
      const set = new Set(value);
      return self.plainData.filter((d: any) => set.has(d.value));
    },
    initialSelection(value: string[] | null) {
      if (!value) {
        return this.valueObjects(this.defaultSelection);
      }
      return this.valueObjects(value);
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
    setTreeCheckStrictly(v: boolean) {
      self.treeCheckStrictly = v;
    },
    applyDefaultSelection() {
      if (self.optionsLoading) {
        return;
      }

      if (self.default_value_mode === 'reset') {
        self.filter.setValue(self.defaultSelection);
        return;
      }

      const currentSelection = self.filter.value;
      const options = new Set(self.plainData.map((o: any) => o.value));
      const validValues = (currentSelection ?? []).filter((v: any) => options.has(v));
      if (validValues.length > 0) {
        self.filter.setValue(validValues);
      } else {
        self.filter.setValue(self.defaultSelection);
      }
    },
    afterCreate() {
      addDisposer(
        self,
        reaction(() => JSON.stringify(self.defaultSelection), this.applyDefaultSelection, {
          fireImmediately: false,
          delay: 0,
        }),
      );
    },
  }));

export type FilterTreeSelectConfigInstance = Instance<typeof FilterTreeSelectConfigMeta>;

export interface IFilterTreeSelectConfigJson {
  _name: 'tree-select';
  required: boolean;
  min_width: string;
  default_value: IObservableArray<string>;
  static_options: IObservableArray<IFilterConfigModel_SelectOption>;
  options_query_id: string;
  treeCheckStrictly: boolean;
  default_value_mode: 'intersect' | 'reset';
  default_selection_count: number;
}

export interface IFilterTreeSelectConfig extends IFilterBaseTreeSelectConfigInstance {
  // Properties
  _name: 'tree-select';
  default_value: IObservableArray<string>;
  treeCheckStrictly: boolean;

  // Views
  readonly json: IFilterTreeSelectConfigJson;
  readonly defaultSelection: string[];
  optionsByValues(value: any): TSelectOption[];
  valueObjects(value: string[]): unknown[];
  initialSelection(value: string[] | null): string[];
  truthy(value: unknown): boolean;

  // Actions
  setDefaultValue(default_value: string[]): void;
  setDefaultValueMode(v: string | null): void;
  setTreeCheckStrictly(v: boolean): void;
  applyDefaultSelection(): void;
  afterCreate(): void;
}

typeAssert.shouldExtends<IFilterTreeSelectConfig, FilterTreeSelectConfigInstance>();

export const createFilterTreeSelectConfig = () =>
  FilterTreeSelectConfigMeta.create({
    _name: 'tree-select',
    default_value: [],
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
