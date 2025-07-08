import dayjs from 'dayjs';
import _ from 'lodash';
import { MericoDateRangeValue } from '~/model';

export type GetRange = (step: string | null) => MericoDateRangeValue;
type Shrotcut = {
  key: string;
  value: string;
  group: 'last' | 'recent' | 'this' | 'this_so_far';
  getRange: GetRange;
};

export const getMericoDateRangeShortcuts = (): Shrotcut[] => [
  {
    key: 'm',
    value: 'last month',
    group: 'last',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(1, 'month').startOf('month').toDate(),
          dayjs(now).subtract(1, 'month').endOf('month').toDate(),
        ],
        shortcut: 'last month',
        step,
      };
    },
  },
  {
    key: 'm2',
    value: 'last 2 months',
    group: 'last',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(2, 'month').startOf('month').toDate(),
          dayjs(now).subtract(1, 'month').endOf('month').toDate(),
        ],
        shortcut: 'last 2 months',
        step,
      };
    },
  },
  {
    key: 'm3',
    value: 'last 3 months',
    group: 'last',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(3, 'month').startOf('month').toDate(),
          dayjs(now).subtract(1, 'month').endOf('month').toDate(),
        ],
        shortcut: 'last 3 months',
        step,
      };
    },
  },
  {
    key: 'm6',
    value: 'last 6 months',
    group: 'last',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(6, 'month').startOf('month').toDate(),
          dayjs(now).subtract(1, 'month').endOf('month').toDate(),
        ],
        shortcut: 'last 6 months',
        step,
      };
    },
  },
  {
    key: 'y',
    value: 'last year',
    group: 'last',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(1, 'year').startOf('year').toDate(),
          dayjs(now).subtract(1, 'year').endOf('year').toDate(),
        ],
        shortcut: 'last year',
        step,
      };
    },
  },
  {
    key: 'd30',
    value: 'recent 30 days',
    group: 'recent',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(30, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 30 days',
        step,
      };
    },
  },
  {
    key: 'd60',
    value: 'recent 60 days',
    group: 'recent',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(60, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 60 days',
        step,
      };
    },
  },
  {
    key: 'd90',
    value: 'recent 90 days',
    group: 'recent',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(90, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 90 days',
        step,
      };
    },
  },
  {
    key: 'd180',
    value: 'recent 180 days',
    group: 'recent',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(180, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 180 days',
        step,
      };
    },
  },
  {
    key: 'd365',
    value: 'recent 365 days',
    group: 'recent',
    getRange: (step) => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(365, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 365 days',
        step,
      };
    },
  },
];

export function getMericoDateRangeShortcutValue(shortcutValue: string | null, step: string | null) {
  if (!shortcutValue) {
    return null;
  }

  const shortcuts = getMericoDateRangeShortcuts();
  const shortcut = shortcuts.find((s) => s.value === shortcutValue);
  if (shortcut) {
    return shortcut.getRange(step);
  }
  return null;
}

export function getMericoShortcutsInGroups() {
  return _.groupBy(getMericoDateRangeShortcuts(), 'group');
}
