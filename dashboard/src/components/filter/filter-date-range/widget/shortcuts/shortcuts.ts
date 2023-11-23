import dayjs from 'dayjs';
import { DateRangeValue } from '../type';

export type GetRange = () => DateRangeValue;
type Shrotcut = {
  label: string;
  value: string;
  group: 'last' | 'recent' | 'this';
  getRange: GetRange;
};

export const getDateRangeShortcuts = (): Shrotcut[] => [
  {
    label: 'yesterday',
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
    label: 'week',
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
    label: 'month',
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
    label: '2 months',
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
    label: '3 months',
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
    label: 'year',
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
    label: '7 days',
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
    label: '30 days',
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
    label: '60 days',
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
    label: '90 days',
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
    label: '180 days',
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
    label: '365 days',
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
    label: 'today',
    value: 'today',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('day').toDate(), dayjs(now).endOf('day').toDate()];
    },
  },
  {
    label: 'week',
    value: 'this week',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('week').toDate(), dayjs(now).endOf('week').toDate()];
    },
  },
  {
    label: 'month',
    value: 'this month',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('month').toDate(), dayjs(now).endOf('month').toDate()];
    },
  },
  {
    label: '2 months',
    value: 'this 2 months',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('month').toDate(), dayjs(now).add(1, 'month').endOf('week').toDate()];
    },
  },
  {
    label: '3 months',
    value: 'this 3 months',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return [dayjs(now).startOf('month').toDate(), dayjs(now).add(2, 'month').endOf('week').toDate()];
    },
  },
  {
    label: 'year',
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
