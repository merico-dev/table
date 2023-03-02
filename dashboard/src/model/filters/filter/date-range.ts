import dayjs from 'dayjs';

import { getParent, getRoot, Instance, types } from 'mobx-state-tree';
export type TDateRangePickerValue = [string | null, string | null];

function postProcessDefaultValue(default_value: Array<number | string | null>, inputFormat: string) {
  return default_value.map((v) => {
    try {
      if (!v) {
        return null;
      }
      return dayjs.tz(v, 'UTC').format(inputFormat);
    } catch (error) {
      console.log(`[date-range] failed parsing ${v}`);
      return null;
    }
  });
}

const _FilterConfigModel_DateRange = types
  .model('FilterConfigModel_DateRange', {
    _name: types.literal('date-range'),
    required: types.boolean,
    inputFormat: types.enumeration('DateRangeInputFormat', ['YYYY', 'YYYYMM', 'YYYYMMDD', 'YYYY-MM', 'YYYY-MM-DD']),
    default_value: types.optional(types.array(types.union(types.string, types.null)), [null, null]),
    clearable: types.boolean,
    max_days: types.optional(types.number, 0),
    allowSingleDateInRange: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get json() {
      const { _name, max_days, required, clearable, inputFormat, default_value, allowSingleDateInRange } = self;
      return {
        _name,
        max_days,
        required,
        clearable,
        inputFormat,
        default_value: postProcessDefaultValue(default_value, inputFormat),
        allowSingleDateInRange,
      };
    },
    truthy(value: any) {
      return Array.isArray(value) && value.length === 2 && value.every((d) => !!d);
    },
  }))
  .views((self) => ({
    getMaxDate(startDate: Date | null) {
      const { max_days } = self;
      if (!max_days || !startDate) {
        return undefined;
      }
      return dayjs(startDate).startOf('day').add(max_days, 'days').toDate();
    },
    getMinDate(endDate: Date | null) {
      const { max_days } = self;
      if (!max_days || !endDate) {
        return undefined;
      }
      return dayjs(endDate).startOf('day').subtract(max_days, 'days').toDate();
    },
  }))
  .actions((self) => ({
    setFilterValue(v: TDateRangePickerValue) {
      try {
        const filter = getParent(self);
        const root = getRoot(self);
        // @ts-expect-error type of getRoot & getPraent
        root.filters.setValueByKey(filter.key, v);
      } catch (error) {
        console.error(error);
      }
    },
  }))
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
      self.setFilterValue(v);
    },
    setMaxDays(v: number) {
      self.max_days = v;
      if (v > 0) {
        self.clearable = true;
      }
    },
    setAllowSingleDateInRange(v: boolean) {
      self.allowSingleDateInRange = v;
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
      default_value: postProcessDefaultValue(default_value, rest.inputFormat),
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
