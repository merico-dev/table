import { FilterMetaSnapshotOut } from '~/model';
import { FilterValuesType } from './types';
import dayjs from 'dayjs';

export function formatDefaultValue(
  v: string | boolean | string[] | (string | null)[],
  config: FilterMetaSnapshotOut['config'],
) {
  if (v === undefined) {
    return v;
  }
  if (config._name === 'date-range') {
    try {
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
