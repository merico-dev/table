import { Instance, types } from 'mobx-state-tree';
import { createFilterConfig_Checkbox, FilterConfigModel_Checkbox } from './checkbox';
import { DashboardFilterType } from './common';
import { createFilterConfig_DateRange, FilterConfigModel_DateRange } from './date-range';
import { createFilterConfig_MultiSelect, FilterConfigModel_MultiSelect } from './multi-select';
import { createFilterConfig_Select, FilterConfigModel_Select } from './select';
import { createFilterConfig_TextInput, FilterConfigModel_TextInput } from './text-input';

export const FilterModel = types
  .model('FilterModel', {
    id: types.identifier,
    key: types.string,
    label: types.string,
    order: types.number,
    visibleInViewsIDs: types.array(types.string),
    type: types.enumeration('DashboardFilterType', [
      DashboardFilterType.Select,
      DashboardFilterType.MultiSelect,
      DashboardFilterType.TextInput,
      DashboardFilterType.Checkbox,
      DashboardFilterType.DateRange,
    ]),
    config: types.union(
      {
        dispatcher: (snapshot) => {
          switch (snapshot._name) {
            case DashboardFilterType.Select:
              return FilterConfigModel_Select;
            case DashboardFilterType.MultiSelect:
              return FilterConfigModel_MultiSelect;
            case DashboardFilterType.TextInput:
              return FilterConfigModel_TextInput;
            case DashboardFilterType.Checkbox:
              return FilterConfigModel_Checkbox;
            case DashboardFilterType.DateRange:
              return FilterConfigModel_DateRange;
            default:
              console.error(`[filter model] invalid filter.config._name: ${snapshot._name}`);
              return FilterConfigModel_TextInput;
          }
        },
      },
      FilterConfigModel_Select,
      FilterConfigModel_MultiSelect,
      FilterConfigModel_TextInput,
      FilterConfigModel_Checkbox,
      FilterConfigModel_DateRange,
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
          self.config = createFilterConfig_Select();
          break;
        case DashboardFilterType.MultiSelect:
          self.config = createFilterConfig_MultiSelect();
          break;
        case DashboardFilterType.TextInput:
          self.config = createFilterConfig_TextInput();
          break;
        case DashboardFilterType.Checkbox:
          self.config = createFilterConfig_Checkbox();
          break;
        case DashboardFilterType.DateRange:
          self.config = createFilterConfig_DateRange();
          break;
      }
      self.type = type;
    },
    setVisibleInViewsIDs(ids: string[]) {
      self.visibleInViewsIDs.length = 0;
      self.visibleInViewsIDs.push(...ids);
    },
  }));

export type FilterModelInstance = Instance<typeof FilterModel>;
