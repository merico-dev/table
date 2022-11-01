import dayjs from 'dayjs';
import _ from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, cast, types } from 'mobx-state-tree';
import { FilterModel, FilterModelInstance } from './filter';

function formatDefaultValue(v: any, config: any) {
  if (v === undefined) {
    return v;
  }
  if (Array.isArray(v)) {
    try {
      return v.map((v) => {
        const d = dayjs.tz(v, 'UTC').format(config.inputFormat); // for date-range
        return d ?? v;
      });
    } catch (error) {
      console.error(error);
      return v;
    }
  }
  return v;
}

function getValuesFromFilters(filters: FilterModelInstance[]) {
  return filters.reduce((ret, filter) => {
    ret[filter.key] = formatDefaultValue(filter.config.default_value, filter.config);
    return ret;
  }, {} as FilterValuesType);
}

export const FiltersModel = types
  .model('FiltersModel', {
    original: types.optional(types.array(FilterModel), []),
    current: types.optional(types.array(FilterModel), []),
    values: types.optional(types.frozen(), {}),
  })
  .views((self) => ({
    get changed() {
      return !_.isEqual(self.original, self.current);
    },
    get firstID() {
      if (self.current.length === 0) {
        return undefined;
      }
      return self.current[0].id;
    },
    get inOrder() {
      return _.sortBy(self.current, 'order');
    },
    get empty() {
      return self.current.length === 0;
    },
    visibleInView(viewID: string) {
      return _.sortBy(
        self.current.filter((f) => f.visibleInViewsIDs.includes(viewID)),
        'order',
      );
    },
    get triggerForRefreshValues() {
      const ret = self.current.map((f) => f.config.default_value?.toString()).join('__');
      return ret;
    },
    get firstFilterValueKey() {
      return Object.keys(self.values)[0] ?? '';
    },
  }))
  .actions((self) => {
    return {
      reset() {
        self.current = _.cloneDeep(self.original);
      },
      replace(current: Array<FilterModelInstance>) {
        self.current = cast(current);
      },
      append(item: FilterModelInstance) {
        self.current.push(item);
      },
      remove(index: number) {
        self.current.splice(index, 1);
      },
      setValues(values: Record<string, $TSFixMe>) {
        self.values = values;
      },
      setValueByKey(key: string, value: $TSFixMe) {
        self.values = {
          ...self.values,
          [key]: value,
        };
      },
      getValueByKey(key: string) {
        return self.values[key];
      },
      refreshValues() {
        console.log('refreshing values');
        const values = getValuesFromFilters(self.current);
        self.values = values;
      },
    };
  })
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => self.triggerForRefreshValues, self.refreshValues, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));

export * from './filter';

export type FilterValuesType = Record<string, $TSFixMe>;

export function getInitialFiltersPayload(filters: FilterModelInstance[]) {
  return {
    original: filters,
    current: filters,
    values: getValuesFromFilters(filters),
  };
}
