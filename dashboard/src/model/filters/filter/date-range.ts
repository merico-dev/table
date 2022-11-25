import dayjs from 'dayjs';

import { Instance, types } from 'mobx-state-tree';
export type TDateRangePickerValue = [string | null, string | null];

const _FilterConfigModel_DateRange = types
  .model('FilterConfigModel_DateRange', {
    _name: 'date-range',
    required: types.boolean,
    inputFormat: types.enumeration('DateRangeInputFormat', ['YYYY', 'YYYYMM', 'YYYYMMDD', 'YYYY-MM', 'YYYY-MM-DD']),
    default_value: types.optional(types.array(types.union(types.string, types.null)), [null, null]),
    clearable: types.boolean,
  })
  .actions((self) => ({
    setRequired(required: boolean) {
      self.required = required;
    },
    setClearable(clearable: boolean) {
      self.clearable = clearable;
    },
    setInputFormat(inputFormat: string) {
      self.inputFormat = inputFormat;
    },
    setDefaultValue(v: TDateRangePickerValue) {
      self.default_value.length = 0;
      self.default_value.push(...v);
    },
  }));

export const FilterConfigModel_DateRange = types.snapshotProcessor(_FilterConfigModel_DateRange, {
  preProcessor({ default_value, ...rest }: $TSFixMe) {
    return {
      ...rest,
      default_value: default_value.map((v: string | null) => {
        return v === null ? null : dayjs.tz(v, 'UTC').toISOString();
      }),
    };
  },
  postProcessor({ default_value, ...rest }) {
    return {
      ...rest,
      default_value: default_value.map((v: number | string | null) => {
        try {
          if (!v) {
            return null;
          }
          return dayjs.tz(v, 'UTC').format(rest.inputFormat);
        } catch (error) {
          console.log(`[date-range] failed parsing ${v}`);
          return null;
        }
      }),
    };
  },
});

export type IFilterConfig_DateRange = Instance<typeof FilterConfigModel_DateRange>;

export const createFilterConfig_DateRange = () =>
  FilterConfigModel_DateRange.create({
    _name: 'date-range',
    required: false,
    inputFormat: 'YYYY-MM-DD',
    clearable: false,
    default_value: [null, null],
  });
