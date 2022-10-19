import { DateRangePickerValue } from '@mantine/dates';
import { Instance, types } from 'mobx-state-tree';

const _FilterConfigModel_DateRange = types
  .model('FilterConfigModel_DateRange', {
    required: types.boolean,
    inputFormat: types.enumeration('DateRangeInputFormat', ['YYYY', 'YYYY-MM', 'YYYY-MM-DD']),
    default_value: types.optional(types.array(types.union(types.Date, types.null)), [null, null]),
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
    setDefaultValue(v: DateRangePickerValue) {
      self.default_value.length = 0;
      self.default_value.push(...v);
    },
  }));

export const FilterConfigModel_DateRange = types.snapshotProcessor(_FilterConfigModel_DateRange, {
  preProcessor({ default_value, ...rest }: $TSFixMe) {
    return {
      ...rest,
      default_value: default_value.map((v: string | null) => {
        return v === null ? null : new Date(v);
      }),
    };
  },
  postProcessor({ default_value, ...rest }) {
    return {
      ...rest,
      default_value: default_value.map((v: number | null) => {
        try {
          return typeof v === 'number' ? new Date(v).toISOString() : null;
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
    required: false,
    inputFormat: 'YYYY-MM-DD',
    clearable: false,
    default_value: [null, null],
  });
