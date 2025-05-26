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
import { FilterMeta, FilterMetaInstance, FiltersRenderModel, TDashboardStateItem } from '~/model';
import { formatDefaultValue } from '~/model/render-model/dashboard/content/filters/utils';
import { AnyObject, DashboardFilterType } from '~/types';
import { FilterModel } from './filter-model';

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
  .compose(
    'FiltersModel',
    FiltersRenderModel,
    types.model({
      current: types.optional(types.array(FilterModel), []),
      // values to be displayed in preview content, e.g. Data Settings
      previewValues: types.optional(types.frozen(), {}),
    }),
  )
  .views((self) => ({
    get idSet() {
      return new Set(self.current.map((f) => f.id));
    },
    get keySet() {
      return new Set(self.current.map((f) => f.key));
    },
    keyStateItemMap(values: Record<string, any>) {
      return self.current.reduce((acc, f) => {
        acc[f.key] = {
          type: f.type,
          label: f.label ?? f.id,
          value: f.id,
          string: `${f.label}: ${values[f.key]}`,
        };
        return acc;
      }, {} as Record<string, TDashboardStateItem>);
    },
    get options() {
      return self.current.map(
        (f) =>
          ({
            label: f.label ?? f.id,
            value: f.id,
            _type: 'filter',
          } as const),
      );
    },
    get selects() {
      return self.current
        .filter((f) => f.type === DashboardFilterType.Select)
        .map(
          (f) =>
            ({
              label: f.label ?? f.id,
              value: f.id,
            } as const),
        );
    },
    get keyLabelOptions() {
      return self.current.map((f) => ({
        label: f.label ?? f.key,
        value: f.key,
        widget: f.type,
      }));
    },
    get sortedList() {
      return _.sortBy(self.current, (o) => o.label.toLowerCase());
    },
  }))
  .actions((self) => {
    return {
      replace(current: Array<FilterMetaInstance>) {
        self.current = cast(current);
      },
      append(item: FilterMetaInstance) {
        self.current.push(item);
      },
      appendMultiple(items: FilterMetaInstance[]) {
        if (items.length === 0) {
          return;
        }

        const newItems = items.filter((item) => !self.idSet.has(item.id));
        self.current.push(...newItems);
      },
      remove(index: number) {
        self.current.splice(index, 1);
      },
      removeByID(id: string) {
        const index = self.current.findIndex((f) => f.id === id);
        if (index >= 0) {
          self.current.splice(index, 1);
        }
      },
      updatePreviewValues(values: AnyObject) {
        self.previewValues = values;
      },
    };
  })
  .actions((self) => {
    function updateValuesAfterChangeFilterType() {
      afterModelAction(self.current, FilterMeta, (action, filter) => {
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
export * from './filter-model';
