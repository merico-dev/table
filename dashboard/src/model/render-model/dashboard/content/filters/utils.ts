import dayjs from 'dayjs';
import { getDateRangeShortcutValue } from '~/components/filter/filter-date-range/widget/shortcuts/shortcuts';
import { FilterMetaSnapshotOut } from '~/model';
import { FilterValuesType } from './types';

export function formatDefaultValue(
  v: string | boolean | string[] | (string | null)[],
  config: FilterMetaSnapshotOut['config'],
) {
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

export function getValuesFromFilters(filters: FilterMetaSnapshotOut[]) {
  return filters.reduce((ret, filter) => {
    ret[filter.key] = formatDefaultValue(filter.config.default_value, filter.config);
    return ret;
  }, {} as FilterValuesType);
}
