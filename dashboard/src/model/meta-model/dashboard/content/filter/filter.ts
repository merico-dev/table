import _ from 'lodash';
import { toJS } from 'mobx';
import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { DashboardFilterType } from './types';
import { FilterCheckboxConfigMeta, createFilterCheckboxConfig } from './widgets/checkbox';
import { FilterDateRangeConfigMeta, createFilterDateRangeConfig } from './widgets/date-range';
import { FilterMultiSelectConfigMeta, createFilterMultiSelectConfig } from './widgets/multi-select';
import { FilterSelectConfigMeta, createFilterSelectConfig } from './widgets/select';
import { FilterTextInputConfigMeta, createFilterTextInputConfig } from './widgets/text-input';
import { FilterTreeSelectConfigMeta, createFilterTreeSelectConfig } from './widgets/tree-select';

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
      DashboardFilterType.TextInput,
      DashboardFilterType.Checkbox,
      DashboardFilterType.DateRange,
    ]),
    config: types.union(
      FilterSelectConfigMeta,
      FilterMultiSelectConfigMeta,
      FilterTreeSelectConfigMeta,
      FilterTextInputConfigMeta,
      FilterCheckboxConfigMeta,
      FilterDateRangeConfigMeta,
    ),
  })
  .views((self) => ({
    get plainDefaultValue() {
      const v = self.config.default_value;
      if (Array.isArray(v)) {
        return [...v];
      }
      return v;
    },
    get usingDefaultValue() {
      return self.type !== DashboardFilterType.TreeSelect;
    },
    get usingDefaultValueFunc() {
      return !!self.default_value_func;
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
    setLabel(label: string) {
      self.label = label;
    },
    setOrder(order: number) {
      self.order = order;
    },
    setType(type: DashboardFilterType) {
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
        case DashboardFilterType.TextInput:
          self.config = createFilterTextInputConfig();
          break;
        case DashboardFilterType.Checkbox:
          self.config = createFilterCheckboxConfig();
          break;
        case DashboardFilterType.DateRange:
          self.config = createFilterDateRangeConfig();
          break;
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
