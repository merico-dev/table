import dayjs from 'dayjs';
import _ from 'lodash';
import {
  addDisposer,
  addMiddleware,
  cast,
  getType,
  IAnyComplexType,
  IAnyStateTreeNode,
  Instance,
  types,
} from 'mobx-state-tree';
import { AnyObject } from '~/types';
import { FilterModel, FilterModelInstance, FilterModelSnapshotOut } from './filter';

function formatDefaultValue(v: AnyObject, config: FilterModelSnapshotOut['config']) {
  if (v === undefined) {
    return v;
  }
  if (config._name === 'date-range') {
    try {
      const dateTimeStrings = v as [string | null, string | null];
      return dateTimeStrings.map((v) => {
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

function afterModelAction<T extends IAnyComplexType>(
  target: IAnyStateTreeNode,
  instanceType: T,
  callback: (action: string, instance: Instance<T>) => void,
) {
  addDisposer(
    target,
    addMiddleware(target, (call, next) => {
      next(call, () => {
        if (getType(call.context) === instanceType && call.type === 'action') {
          callback(call.name, call.context as Instance<T>);
        }
      });
    }),
  );
}

export const FiltersModel = types
  .model('FiltersModel', {
    current: types.optional(types.array(FilterModel), []),
    values: types.optional(types.frozen(), {}),
    /**
     * values to be displayed in preview content, e.g. Data Settings
     */
    previewValues: types.optional(types.frozen(), {}),
  })
  .views((self) => ({
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
    get firstFilterValueKey() {
      return Object.keys(self.values)[0] ?? '';
    },
    get keyLabelMap() {
      return self.current.reduce((ret, f) => {
        ret[f.key] = f.label;
        return ret;
      }, {} as Record<string, string>);
    },
  }))
  .actions((self) => {
    return {
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
        self.values = getValuesFromFilters(self.current);
      },
      updatePreviewValues(values: AnyObject) {
        self.previewValues = values;
      },
    };
  })
  .actions((self) => {
    function updateValuesAfterChangeFilterType() {
      afterModelAction(self.current, FilterModel, (action, filter) => {
        if (action === 'setType') {
          const defaultValue = formatDefaultValue(filter.config.default_value, filter.config);
          self.setValueByKey(filter.key, defaultValue);
          self.updatePreviewValues({
            ...self.previewValues,
            [filter.key]: defaultValue,
          });
        }
      });
    }

    return {
      afterCreate() {
        updateValuesAfterChangeFilterType();
      },
    };
  });
export type FiltersModelInstance = Instance<typeof FiltersModel>;
export * from './filter';

export type FilterValuesType = Record<string, $TSFixMe>;

export function getInitialFiltersPayload(filters: FilterModelInstance[]) {
  return {
    current: filters,
    values: getValuesFromFilters(filters),
  };
}
