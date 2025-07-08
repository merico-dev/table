import dayjs from 'dayjs';
import { type IObservableArray } from 'mobx';
import { getParent, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { typeAssert } from '~/types/utils';
import { DateRangeValue_Value } from './date-range';
import { getMericoDateRangeShortcutValue } from '~/components/filter/filter-merico-date-range/widget/shortcuts/shortcuts';

export type MericoDateRangeValue = {
  value: DateRangeValue_Value;
  shortcut: string | null;
  step: string;
};

export function getStaticMericoDateRangeDefaultValue(
  config: FilterMericoDateRangeConfigSnapshotOut,
): MericoDateRangeValue {
  try {
    if (config.default_shortcut) {
      const range = getMericoDateRangeShortcutValue(config.default_shortcut, config.default_step);
      if (range) {
        return {
          value: range.value.map((d) => dayjs(d).toDate()) as DateRangeValue_Value,
          shortcut: config.default_shortcut,
          step: config.default_step,
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
      step: config.default_step,
    };
  } catch (error) {
    console.error(error);
    return {
      value: [null, null],
      shortcut: null,
      step: config.default_step,
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

const _FilterMericoDateRangeConfigMeta = types
  .model('FilterMericoDateRangeConfigMeta', {
    _name: types.literal('date-range'),
    required: types.boolean,
    inputFormat: types.enumeration<'YYYY/MM/DD'>('DateRangeInputFormat', ['YYYY/MM/DD']),
    default_value: types.optional(types.array(types.union(types.Date, types.null)), [null, null]),
    default_shortcut: types.optional(types.string, ''),
    default_step: types.optional(types.string, 'day'),
    allowSingleDateInRange: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get json() {
      const { _name, required, inputFormat, default_step, default_value, default_shortcut, allowSingleDateInRange } =
        self;
      return {
        _name,
        required,
        inputFormat,
        default_step,
        default_value: postProcessDefaultValue(default_value, inputFormat),
        default_shortcut,
        allowSingleDateInRange,
      };
    },
    truthy(fullValue: MericoDateRangeValue) {
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
    setFilterValue(v: MericoDateRangeValue) {
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
    setDefaultValue(v: MericoDateRangeValue) {
      self.default_value.length = 0;
      self.default_value.push(...v.value);
      self.setFilterValue(v);
    },
    setDefaultShortcut(v: string | null) {
      self.default_shortcut = v ?? '';
      if (!v) {
        return;
      }

      const range = getMericoDateRangeShortcutValue(self.default_shortcut, self.default_step);
      if (range) {
        self.setFilterValue(range);
      }
    },
    setAllowSingleDateInRange(v: boolean) {
      self.allowSingleDateInRange = v;
    },
    setDefaultStep(v: string | null) {
      self.default_step = v ?? '';
    },
  }));

export const FilterMericoDateRangeConfigMeta = types.snapshotProcessor(_FilterMericoDateRangeConfigMeta, {
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

export type FilterMericoDateRangeConfigInstance = Instance<typeof FilterMericoDateRangeConfigMeta>;
export interface IFilterMericoDateRangeConfig {
  // Properties
  _name: 'date-range';
  required: boolean;
  inputFormat: 'YYYY/MM/DD';
  default_value: IObservableArray<Date | null>;
  default_shortcut: string;
  default_step: string;
  allowSingleDateInRange: boolean;

  // Views
  readonly json: {
    _name: 'date-range';
    required: boolean;
    inputFormat: 'YYYY/MM/DD';
    default_step: string;
    default_value: string[];
    default_shortcut: string;
    allowSingleDateInRange: boolean;
  };
  truthy(fullValue: MericoDateRangeValue): boolean;
  readonly filter: Record<string, unknown>;
  readonly dateStringsValue: [string, string];

  // Actions
  setFilterValue(v: MericoDateRangeValue): void;
  setRequired(required: boolean): void;
  setDefaultValue(v: MericoDateRangeValue): void;
  setDefaultShortcut(v: string | null): void;
  setDefaultStep(v: string | null): void;
  setAllowSingleDateInRange(v: boolean): void;
}
typeAssert.shouldExtends<IFilterMericoDateRangeConfig, FilterMericoDateRangeConfigInstance>();
export type FilterMericoDateRangeConfigSnapshotOut = SnapshotOut<typeof FilterMericoDateRangeConfigMeta>;

export const createFilterMericoDateRangeConfig = () =>
  FilterMericoDateRangeConfigMeta.create({
    _name: 'date-range',
    required: false,
    inputFormat: 'YYYY/MM/DD',
    default_value: [null, null],
    default_shortcut: '',
    default_step: 'day',
    allowSingleDateInRange: false,
  });
