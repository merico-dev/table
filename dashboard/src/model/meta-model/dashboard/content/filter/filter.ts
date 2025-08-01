import _ from 'lodash';
import { toJS, type IObservableArray } from 'mobx';
import { Instance, SnapshotOut, getRoot, types } from 'mobx-state-tree';
import { DashboardFilterType } from './types';
import { FilterCheckboxConfigMeta, createFilterCheckboxConfig, type IFilterCheckboxConfig } from './widgets/checkbox';
import {
  FilterDateRangeConfigMeta,
  createFilterDateRangeConfig,
  type IFilterDateRangeConfig,
} from './widgets/date-range';
import {
  FilterMultiSelectConfigMeta,
  createFilterMultiSelectConfig,
  type IFilterMultiSelectConfig,
} from './widgets/multi-select';
import { FilterSelectConfigMeta, createFilterSelectConfig, type IFilterSelectConfig } from './widgets/select';
import {
  FilterTextInputConfigMeta,
  createFilterTextInputConfig,
  type IFilterTextInputConfig,
} from './widgets/text-input';
import {
  FilterTreeSelectConfigMeta,
  createFilterTreeSelectConfig,
  type IFilterTreeSelectConfig,
} from './widgets/tree-select';
import {
  createFilterMericoDateRangeConfig,
  createFilterTreeSingleSelectConfig,
  FilterMericoDateRangeConfigMeta,
  FilterTreeSingleSelectConfigMeta,
  IFilterMericoDateRangeConfig,
  type IFilterTreeSingleSelectConfig,
} from './widgets';
import { typeAssert } from '~/types/utils';

export const FilterMeta = types
  .model('FilterMeta', {
    id: types.identifier,
    key: types.string,
    label: types.string,
    order: types.number,
    visibleInViewsIDs: types.array(types.string),
    auto_submit: types.optional(types.boolean, false),
    default_value_func: types.optional(types.string, ''),
    type: types.enumeration('DashboardFilterType', [
      DashboardFilterType.Select,
      DashboardFilterType.MultiSelect,
      DashboardFilterType.TreeSelect,
      DashboardFilterType.TreeSingleSelect,
      DashboardFilterType.TextInput,
      DashboardFilterType.Checkbox,
      DashboardFilterType.DateRange,
      DashboardFilterType.MericoDateRange,
    ]),
    config: types.union(
      FilterSelectConfigMeta,
      FilterMultiSelectConfigMeta,
      FilterTreeSelectConfigMeta,
      FilterTreeSingleSelectConfigMeta,
      FilterTextInputConfigMeta,
      FilterCheckboxConfigMeta,
      FilterDateRangeConfigMeta,
      FilterMericoDateRangeConfigMeta,
    ),
  })
  .views((self) => ({
    get contentModel(): any {
      // @ts-expect-error typeof getRoot
      return getRoot(self).content;
    },
    get filters(): any {
      return this.contentModel.filters;
    },
    get value() {
      return this.filters.values[self.key];
    },
    get plainDefaultValue() {
      const v = self.config.default_value;
      if (Array.isArray(v)) {
        return [...v];
      }
      return v;
    },
    get usingDefaultValue() {
      return self.type !== DashboardFilterType.TreeSelect && self.type !== DashboardFilterType.TreeSingleSelect;
    },
    get usingDefaultValueFunc() {
      return !!self.default_value_func;
    },
    get formattedDefaultValue() {
      return this.filters.formattedDefaultValues[self.key];
    },
    get auto_submit_supported() {
      return [DashboardFilterType.Select, DashboardFilterType.Checkbox, DashboardFilterType.DateRange].includes(
        self.type,
      );
    },
  }))
  .views((self) => ({
    get json() {
      const { id, key, label, order, visibleInViewsIDs, default_value_func, auto_submit, type, config } = self;
      return {
        id,
        key,
        type,
        label,
        order,
        config: config.json,
        auto_submit,
        visibleInViewsIDs: toJS(visibleInViewsIDs),
        default_value_func,
      };
    },
    get visibleInViewsIDSet() {
      return new Set(self.visibleInViewsIDs);
    },
    // FIXME: this is a temp workaround. auto_submit should be moved into config
    get should_auto_submit() {
      return self.auto_submit_supported && self.auto_submit;
    },
    requiredAndPass(value: any) {
      const required = _.get(self.config, 'required', false);
      if (!required) {
        return false;
      }
      const handler = _.get(self.config, 'truthy', () => true);
      return handler(value);
    },
  }))
  .actions((self) => ({
    setKey(key: string) {
      self.key = key;
    },
    setValue(value: any) {
      self.filters.setValueByKey(self.key, value);
    },
    setLabel(label: string) {
      self.label = label;
    },
    setOrder(order: number | string) {
      const n = Number(order);
      if (Number.isFinite(n)) {
        self.order = n;
      }
    },
    setType(type: string | null) {
      switch (type) {
        case DashboardFilterType.Select:
          self.config = createFilterSelectConfig();
          break;
        case DashboardFilterType.MultiSelect:
          self.config = createFilterMultiSelectConfig();
          break;
        case DashboardFilterType.TreeSelect:
          self.config = createFilterTreeSelectConfig();
          break;
        case DashboardFilterType.TreeSingleSelect:
          self.config = createFilterTreeSingleSelectConfig();
          break;
        case DashboardFilterType.TextInput:
          self.config = createFilterTextInputConfig();
          break;
        case DashboardFilterType.Checkbox:
          self.config = createFilterCheckboxConfig();
          break;
        case DashboardFilterType.DateRange:
          self.config = createFilterDateRangeConfig();
          break;
        case DashboardFilterType.MericoDateRange:
          self.config = createFilterMericoDateRangeConfig();
          break;
        default:
          return;
      }
      self.type = type;
    },
    setVisibleInViewsIDs(ids: string[]) {
      self.visibleInViewsIDs.length = 0;
      self.visibleInViewsIDs.push(...ids);
    },
    setAutoSubmit(v: boolean) {
      self.auto_submit = self.auto_submit_supported && v;
    },
    setDefaultValueFunc(v: string) {
      self.default_value_func = v;
    },
  }));

export type FilterMetaInstance = Instance<typeof FilterMeta>;
export type FilterMetaSnapshotOut = SnapshotOut<FilterMetaInstance>;

export interface IFilterMeta {
  // Properties
  id: string;
  key: string;
  label: string;
  order: number;
  visibleInViewsIDs: IObservableArray<string>;
  auto_submit: boolean;
  default_value_func: string;
  type: DashboardFilterType;
  config:
    | IFilterSelectConfig
    | IFilterMultiSelectConfig
    | IFilterTreeSelectConfig
    | IFilterTreeSingleSelectConfig
    | IFilterTextInputConfig
    | IFilterCheckboxConfig
    | IFilterDateRangeConfig
    | IFilterMericoDateRangeConfig;

  // Views
  readonly contentModel: Record<string, unknown>;
  readonly filters: Record<string, unknown>;
  readonly value: unknown;
  readonly plainDefaultValue: unknown;
  readonly usingDefaultValue: boolean;
  readonly usingDefaultValueFunc: boolean;
  readonly formattedDefaultValue: unknown;
  readonly auto_submit_supported: boolean;
  readonly json: {
    id: string;
    key: string;
    type: DashboardFilterType;
    label: string;
    order: number;
    config: Record<string, unknown>;
    auto_submit: boolean;
    visibleInViewsIDs: IObservableArray<string>;
    default_value_func: string;
  };
  readonly visibleInViewsIDSet: Set<string>;
  readonly should_auto_submit: boolean;
  requiredAndPass(value: unknown): boolean;

  // Actions
  setKey(key: string): void;
  setValue(value: unknown): void;
  setLabel(label: string): void;
  setOrder(order: number | string): void;
  setType(type: string | null): void;
  setVisibleInViewsIDs(ids: string[]): void;
  setAutoSubmit(v: boolean): void;
  setDefaultValueFunc(v: string): void;
}

typeAssert.shouldExtends<IFilterMeta, FilterMetaInstance>();
typeAssert.shouldExtends<FilterMetaInstance, IFilterMeta>();
