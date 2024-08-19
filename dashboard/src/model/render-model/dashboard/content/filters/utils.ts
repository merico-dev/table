import {
  ContextRecordType,
  DashboardFilterType,
  FilterDateRangeConfigSnapshotOut,
  FilterMetaSnapshotOut,
  getStaticDateRangeDefaultValue,
} from '~/model';
import { functionUtils } from '~/utils';
import { FilterValuesType } from './types';
import _ from 'lodash';

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
  const v = config.default_value;

  if (v === undefined) {
    return v;
  }
  if (config._name === 'date-range') {
    return getStaticDateRangeDefaultValue(config as FilterDateRangeConfigSnapshotOut);
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
    if (typeof v === 'object' && 'shortcut' in v && Array.isArray(input)) {
      ret[k] = {
        value: input,
        shortcut: null,
      };
    } else {
      ret[k] = input;
    }
    return ret;
  });
  return ret;
}
