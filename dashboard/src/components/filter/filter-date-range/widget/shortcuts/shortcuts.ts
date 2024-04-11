import dayjs from 'dayjs';
import { DateRangeValue } from '../type';

export type GetRange = () => DateRangeValue;
type Shrotcut = {
  key: string;
  value: string;
  group: 'last' | 'recent' | 'this';
  getRange: GetRange;
};

export const getDateRangeShortcuts = (): Shrotcut[] => [
  {
    key: 'd',
    value: 'yesterday',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(1, 'day').startOf('day').toDate(),
        dayjs(now).subtract(1, 'day').endOf('day').toDate(),
      ];
    },
  },
  {
    key: 'w',
    value: 'last week',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(1, 'week').startOf('week').toDate(),
        dayjs(now).subtract(1, 'week').endOf('week').toDate(),
      ];
    },
  },
  {
    key: 'm',
    value: 'last month',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(1, 'month').startOf('month').toDate(),
        dayjs(now).subtract(1, 'month').endOf('month').toDate(),
      ];
    },
  },
  {
    key: 'm2',
    value: 'last 2 months',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(2, 'month').startOf('month').toDate(),
        dayjs(now).subtract(1, 'month').endOf('month').toDate(),
      ];
    },
  },
  {
    key: 'm3',
    value: 'last 3 months',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(3, 'month').startOf('month').toDate(),
        dayjs(now).subtract(1, 'month').endOf('month').toDate(),
      ];
    },
  },
  {
    key: 'y',
    value: 'last year',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(1, 'year').startOf('year').toDate(),
        dayjs(now).subtract(1, 'year').endOf('year').toDate(),
      ];
    },
  },
  {
    key: 'd7',
    value: 'recent 7 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(7, 'day').startOf('day').toDate(),
        dayjs(now).subtract(1, 'day').endOf('day').toDate(),
      ];
    },
  },
  {
    key: 'd30',
    value: 'recent 30 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(30, 'day').startOf('day').toDate(),
        dayjs(now).subtract(1, 'day').endOf('day').toDate(),
      ];
    },
  },
  {
    key: 'd60',
    value: 'recent 60 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(60, 'day').startOf('day').toDate(),
        dayjs(now).subtract(1, 'day').endOf('day').toDate(),
      ];
    },
  },
  {
    key: 'd90',
    value: 'recent 90 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(90, 'day').startOf('day').toDate(),
        dayjs(now).subtract(1, 'day').endOf('day').toDate(),
      ];
    },
  },
  {
    key: 'd180',
    value: 'recent 180 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(180, 'day').startOf('day').toDate(),
        dayjs(now).subtract(1, 'day').endOf('day').toDate(),
      ];
    },
  },
  {
    key: 'd365',
    value: 'recent 365 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return [
        dayjs(now).subtract(365, 'day').startOf('day').toDate(),
        dayjs(now).subtract(1, 'day').endOf('day').toDate(),
      ];
    },
  },
  {
    key: 'd',
    value: 'today',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('day').toDate(), dayjs(now).endOf('day').toDate()];
    },
  },
  {
    key: 'w',
    value: 'this week',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('week').toDate(), dayjs(now).endOf('week').toDate()];
    },
  },
  {
    key: 'm',
    value: 'this month',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('month').toDate(), dayjs(now).endOf('month').toDate()];
    },
  },
  {
    key: 'y',
    value: 'this year',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('year').toDate(), dayjs(now).endOf('year').toDate()];
    },
  },
];

export function getDateRangeShortcutValue(shortcutValue: string) {
  const shortcuts = getDateRangeShortcuts();
  const shortcut = shortcuts.find((s) => s.value === shortcutValue);
  if (shortcut) {
    return shortcut.getRange();
  }
  return null;
}
