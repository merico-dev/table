import dayjs from 'dayjs';

import { getParent, Instance, types } from 'mobx-state-tree';
import { getDateRangeShortcutValue } from '~/components/filter/filter-date-range/widget/shortcuts/shortcuts';
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

const _FilterDateRangeConfigMeta = types
  .model('FilterDateRangeConfigMeta', {
    _name: types.literal('date-range'),
    required: types.boolean,
    inputFormat: types.enumeration('DateRangeInputFormat', ['YYYY', 'YYYYMM', 'YYYYMMDD', 'YYYY-MM', 'YYYY-MM-DD']),
    default_value: types.optional(types.array(types.union(types.string, types.null)), [null, null]),
    default_shortcut: types.optional(types.string, ''),
    clearable: types.boolean, // TODO: will be deprecated
    max_days: types.optional(types.number, 0),
    allowSingleDateInRange: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get json() {
      const {
        _name,
        max_days,
        required,
        clearable,
        inputFormat,
        default_value,
        default_shortcut,
        allowSingleDateInRange,
      } = self;
      return {
        _name,
        max_days,
        required,
        clearable,
        inputFormat,
        default_value: postProcessDefaultValue(default_value, inputFormat),
        default_shortcut,
        allowSingleDateInRange,
      };
    },
    truthy(value: any) {
      return Array.isArray(value) && value.length === 2 && value.every((d) => !!d);
    },
    get filter(): any {
      return getParent(self);
    },
  }))
  .actions((self) => ({
    setFilterValue(v: TDateRangePickerValue) {
      try {
        self.filter.setValue(v);
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
    setDefaultShortcut(v: string) {
      self.default_shortcut = v;
      if (!v) {
        return;
      }

      const range = getDateRangeShortcutValue(self.default_shortcut);
      console.log(range);
      if (range) {
        const newValue = range.map((d) => dayjs(d).format(self.inputFormat)) as TDateRangePickerValue;
        self.setFilterValue(newValue);
      }
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

export const FilterDateRangeConfigMeta = types.snapshotProcessor(_FilterDateRangeConfigMeta, {
  preProcessor({ default_value, ...rest }: $TSFixMe) {
    return {
      ...rest,
      default_value: default_value.map((v: string | null) => {
        return v === null ? null : dayjs.tz(v, 'UTC').toISOString();
      }),
    };
  },
  postProcessor(snap) {
    const { default_value, ...rest } = snap as Omit<typeof snap, symbol>;
    return {
      ...rest,
      default_value: postProcessDefaultValue(default_value, rest.inputFormat),
    };
  },
});

export type FilterDateRangeConfigInstance = Instance<typeof FilterDateRangeConfigMeta>;

export const createFilterDateRangeConfig = () =>
  FilterDateRangeConfigMeta.create({
    _name: 'date-range',
    required: false,
    inputFormat: 'YYYY-MM-DD',
    clearable: false,
    default_value: [null, null],
  });
