import { getDateRangeShortcutValue } from '~/components/filter/filter-date-range/widget/shortcuts/shortcuts';
import {
  ContextRecordType,
  DateRangeValue,
  FilterDateRangeConfigSnapshotOut,
  FilterMericoDateRangeConfigSnapshotOut,
  FilterMetaSnapshotOut,
  getStaticDateRangeDefaultValue,
  getStaticMericoDateRangeDefaultValue,
  MericoDateRangeValue,
} from '~/model';
import { functionUtils } from '~/utils';
import { FilterValuesType } from './types';
import { getMericoDateRangeShortcutValue } from '~/components/filter/filter-merico-date-range/widget/shortcuts/shortcuts';

// if use FilterMetaSnapshotOut: 'filter' is referenced directly or indirectly in its own type annotation.ts(2502)
type LocalFilterMetaSnapshotOut = {
  config: {
    _name: string;
    [key: string]: any;
  };
  default_value_func: string;
  [key: string]: any;
};

export function getStaticDefaultValue(filter: LocalFilterMetaSnapshotOut) {
  const config = filter.config;
  const v = config?.default_value;

  if (v === undefined) {
    return v;
  }
  if (config._name === 'date-range') {
    return getStaticDateRangeDefaultValue(config as FilterDateRangeConfigSnapshotOut);
  }
  if (config._name === 'merico-date-range') {
    return getStaticMericoDateRangeDefaultValue(config as FilterMericoDateRangeConfigSnapshotOut);
  }

  return v;
}

export function getDefaultValueWithFunc(filter: LocalFilterMetaSnapshotOut, context: ContextRecordType) {
  const func = filter.default_value_func;
  try {
    const ret = new Function(`return ${func}`)()(filter, functionUtils, context);
    if (filter.config._name === 'date-range' && Array.isArray(ret)) {
      return {
        value: ret,
        shortcut: null,
      };
    }
    if (filter.config._name === 'merico-date-range' && Array.isArray(ret)) {
      return {
        value: ret,
        shortcut: null,
        step: filter.config.step,
      };
    }
    return ret;
  } catch (error) {
    console.error(error);
    return getStaticDefaultValue(filter);
  }
}

export function formatDefaultValue(filter: LocalFilterMetaSnapshotOut, context: ContextRecordType) {
  if (filter.default_value_func?.trim()) {
    return getDefaultValueWithFunc(filter, context);
  }
  return getStaticDefaultValue(filter);
}

export function getValuesFromFilters(filters: FilterMetaSnapshotOut[], context: ContextRecordType) {
  return filters.reduce((ret, filter) => {
    ret[filter.key] = formatDefaultValue(filter, context);
    return ret;
  }, {} as FilterValuesType);
}

export function formatInputFilterValues(inputValues: FilterValuesType, currentValues: FilterValuesType) {
  const ret: FilterValuesType = {};
  Object.entries(currentValues).forEach(([k, v]) => {
    const input = inputValues[k];
    if (typeof v !== 'object' || !('shortcut' in v) || !input) {
      // not a date-range filter
      ret[k] = input ?? v;
      return ret;
    }

    // legacy date-range value
    if (Array.isArray(input)) {
      console.log('⚪️ adapting legacy date-range value: ', input);
      ret[k] = {
        value: input,
        shortcut: null,
      };
      return ret;
    }

    const inputRange = input as DateRangeValue | MericoDateRangeValue;
    const { shortcut } = inputRange;
    if (!shortcut) {
      console.log('⚪️ skipping input date range when it has no shortcut', inputRange);
      ret[k] = inputRange;
      return ret;
    }

    if ('step' in v) {
      // merico-date-range
      const step = (inputRange as MericoDateRangeValue).step;
      ret[k] = getMericoDateRangeShortcutValue(shortcut, step);
    } else {
      ret[k] = getDateRangeShortcutValue(shortcut);
    }
    return ret;
  });
  return ret;
}
