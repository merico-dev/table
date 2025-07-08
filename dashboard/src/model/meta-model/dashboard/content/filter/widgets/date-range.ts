import dayjs from 'dayjs';
import { type IObservableArray } from 'mobx';
import { getParent, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { getDateRangeShortcutValue } from '~/components/filter/filter-date-range/widget/shortcuts/shortcuts';
import { typeAssert } from '~/types/utils';

export type DateRangeValue_Value = [Date | null, Date | null];
export type DateRangeValue = {
  value: DateRangeValue_Value;
  shortcut: string | null;
};

export function getStaticDateRangeDefaultValue(config: FilterDateRangeConfigSnapshotOut): DateRangeValue {
  try {
    if (config.default_shortcut) {
      const range = getDateRangeShortcutValue(config.default_shortcut);
      if (range) {
        return {
          value: range.value.map((d) => dayjs(d).toDate()) as DateRangeValue_Value,
          shortcut: config.default_shortcut,
        };
      }
    }

    const value = config.default_value.map((v) => {
      if (v === null) {
        return v;
      }
      const d = dayjs.tz(v, 'UTC').toDate();
      return d ?? v;
    }) as DateRangeValue_Value;

    return {
      value,
      shortcut: null,
    };
  } catch (error) {
    console.error(error);
    return {
      value: [null, null],
      shortcut: null,
    };
  }
}

function postProcessDefaultValue(default_value: Array<number | Date | null>, inputFormat: string) {
  return default_value.map((v) => {
    try {
      if (!v) {
        return null;
      }
      return dayjs.tz(v, 'UTC').toISOString();
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
    default_value: types.optional(types.array(types.union(types.Date, types.null)), [null, null]),
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
    truthy(fullValue: DateRangeValue) {
      try {
        const { value } = fullValue;
        return Array.isArray(value) && value.length === 2 && value.every((d) => !!d);
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    get filter(): any {
      return getParent(self);
    },
    get dateStringsValue(): [string, string] {
      try {
        const fullValue = this.filter.value;
        const [begin, end] = fullValue.value;
        const beginStr = begin ? dayjs(begin).format(self.inputFormat) : '';
        const endStr = end ? dayjs(end).format(self.inputFormat) : '';
        return [beginStr, endStr];
      } catch (error) {
        console.error(error);
        return ['', ''];
      }
    },
  }))
  .actions((self) => ({
    setFilterValue(v: DateRangeValue) {
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
    setInputFormat(inputFormat: string | null) {
      if (!inputFormat) {
        return;
      }

      self.inputFormat = inputFormat;
    },
    setDefaultValue(v: DateRangeValue) {
      self.default_value.length = 0;
      self.default_value.push(...v.value);
      self.setFilterValue(v);
    },
    setDefaultShortcut(v: string | null) {
      self.default_shortcut = v ?? '';
      if (!v) {
        return;
      }

      const range = getDateRangeShortcutValue(self.default_shortcut);
      if (range) {
        self.setFilterValue(range);
      }
    },
    setMaxDays(v: number | string) {
      const n = Number(v);
      if (!Number.isFinite(n)) {
        return;
      }

      self.max_days = n;
      if (n > 0) {
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
        return v === null ? null : dayjs.tz(v, 'UTC').toDate();
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
export interface IFilterDateRangeConfig {
  // Properties
  _name: 'date-range';
  required: boolean;
  inputFormat: 'YYYY' | 'YYYYMM' | 'YYYYMMDD' | 'YYYY-MM' | 'YYYY-MM-DD';
  default_value: IObservableArray<Date | null>;
  default_shortcut: string;
  clearable: boolean;
  max_days: number;
  allowSingleDateInRange: boolean;

  // Views
  readonly json: {
    _name: 'date-range';
    max_days: number;
    required: boolean;
    clearable: boolean;
    inputFormat: 'YYYY' | 'YYYYMM' | 'YYYYMMDD' | 'YYYY-MM' | 'YYYY-MM-DD';
    default_value: string[];
    default_shortcut: string;
    allowSingleDateInRange: boolean;
  };
  truthy(fullValue: DateRangeValue): boolean;
  readonly filter: Record<string, unknown>;
  readonly dateStringsValue: [string, string];

  // Actions
  setFilterValue(v: DateRangeValue): void;
  setRequired(required: boolean): void;
  setClearable(clearable: boolean): void;
  setInputFormat(inputFormat: string | null): void;
  setDefaultValue(v: DateRangeValue): void;
  setDefaultShortcut(v: string | null): void;
  setMaxDays(v: number | string): void;
  setAllowSingleDateInRange(v: boolean): void;
}
typeAssert.shouldExtends<IFilterDateRangeConfig, FilterDateRangeConfigInstance>();
export type FilterDateRangeConfigSnapshotOut = SnapshotOut<typeof FilterDateRangeConfigMeta>;

export const createFilterDateRangeConfig = () =>
  FilterDateRangeConfigMeta.create({
    _name: 'date-range',
    required: false,
    inputFormat: 'YYYY-MM-DD',
    clearable: false,
    default_value: [null, null],
  });
