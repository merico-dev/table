import dayjs from 'dayjs';
import { autorun, comparer, computed } from 'mobx';
import { useEffect, useState } from 'react';

import { useDashboardContext } from '../../contexts';
import {
  DashboardFilterType,
  DateRangeValue,
  EViewComponentType,
  FilterDateRangeConfigInstance,
  FilterMericoDateRangeConfigInstance,
  FilterMetaInstance,
  FilterSelectConfigInstance,
  MericoDateRangeValue,
} from '../../model';
import { formatDateRangeValue } from './filter-date-range/render';

const NOT_AVAILABLE = 'N/A';

/**
 * Returns the formatted filter values in the current view.
 */
export function useVisibleFilters(): IFormattedFilter[] {
  const model = useDashboardContext();
  const [visibleFilters, setVisibleFilters] = useState<IFormattedFilter[]>([]);
  useEffect(() => {
    const calc = computed(
      () => {
        const visibleViews = model.content.views.visibleViews;
        const viewIds = visibleViews.map((it) => {
          if (it.type === EViewComponentType.Tabs) {
            return it.tabView?.view_id;
          }
          return it.id;
        });
        const filters = viewIds
          .filter(Boolean)
          .flatMap((it) => model.content.filters.visibleInView(it!))
          .filter(Boolean);

        return filters.map((it) => formatFilter(it));
      },
      {
        equals: comparer.structural,
      },
    );
    const dispose = autorun(() => {
      setVisibleFilters(calc.get());
    });
    return () => dispose();
  }, [model]);
  return visibleFilters;
}

export interface IFormattedFilter {
  label: string;
  value: string | string[];
}

function formatFilter(filter: FilterMetaInstance): IFormattedFilter {
  switch (filter.type) {
    case DashboardFilterType.Select:
    case DashboardFilterType.MultiSelect:
    case DashboardFilterType.TreeSelect:
    case DashboardFilterType.TreeSingleSelect:
      return { label: filter.label, value: valueOfSelect(filter.config, filter.value) };
    case DashboardFilterType.TextInput:
      return { label: filter.label, value: valueOfTextInput(filter.value) };
    case DashboardFilterType.DateRange:
      return { label: filter.label, value: valueOfDateRange(filter.config, filter.value) };
    case DashboardFilterType.MericoDateRange:
      return { label: filter.label, value: valueOfMericoDateRange(filter.config, filter.value) };
    case DashboardFilterType.Checkbox:
      return { label: filter.label, value: valueOfCheckbox(filter.value) };
    default:
      return { label: filter.label, value: filter.value };
  }
}

function valueOfSelect(config: FilterSelectConfigInstance, value: string | string[]): string {
  const set = new Set();
  if (Array.isArray(value)) {
    value.forEach((it) => set.add(it));
  } else {
    set.add(value);
  }
  if (set.size === 0) {
    return NOT_AVAILABLE;
  }
  return config.options
    .filter((it) => set.has(it.value))
    .map((it) => it.label)
    .join(', ');
}

function valueOfTextInput(value: string): string {
  return value;
}

function valueOfDateRange(config: FilterDateRangeConfigInstance, value: DateRangeValue): string {
  const formattedValue = formatDateRangeValue(value);
  const dateValues = formattedValue.value.filter((it) => !!it).map((it) => dayjs(it).format(config.inputFormat));
  if (dateValues.length === 0) {
    return NOT_AVAILABLE;
  }
  return dateValues.join(' - ');
}

function valueOfMericoDateRange(config: FilterMericoDateRangeConfigInstance, value: MericoDateRangeValue): string {
  const formattedValue = formatDateRangeValue(value);
  const dateValues = formattedValue.value.filter((it) => !!it).map((it) => dayjs(it).format(config.inputFormat));
  if (dateValues.length === 0) {
    return NOT_AVAILABLE;
  }
  return dateValues.join(' - ');
}

function valueOfCheckbox(value: boolean): string {
  return value ? '✔️' : '❌';
}
