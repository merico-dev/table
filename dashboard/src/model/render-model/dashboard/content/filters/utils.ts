import dayjs from 'dayjs';
import { getDateRangeShortcutValue } from '~/components/filter/filter-date-range/widget/shortcuts/shortcuts';
import { ContextRecordType, FilterMetaSnapshotOut } from '~/model';
import { FilterValuesType } from './types';
import { functionUtils } from '~/utils';

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
    try {
      if (config.default_shortcut) {
        const range = getDateRangeShortcutValue(config.default_shortcut);
        if (range) {
          return range.map((d) => dayjs(d).format(config.inputFormat));
        }
      }
      const [...dateTimeStrings] = v as [string | null, string | null];
      return dateTimeStrings.map((v) => {
        if (v === null) {
          return v;
        }
        const d = dayjs.tz(v, 'UTC').format(config.inputFormat);
        return d ?? v;
      });
    } catch (error) {
      console.error(error);
      return v;
    }
  }

  return v;
}

export function getDefaultValueWithFunc(filter: LocalFilterMetaSnapshotOut, context: ContextRecordType) {
  const func = filter.default_value_func;
  try {
    return new Function(`return ${func}`)()(filter, functionUtils, context);
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
