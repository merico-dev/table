import dayjs from 'dayjs';
import _ from 'lodash';
import { MericoDateRangeValue } from '~/model';

export type GetRange = (step: string) => MericoDateRangeValue;
type Shrotcut = {
  key: string;
  value: string;
  group: 'last' | 'recent' | 'this' | 'this_so_far';
  disabled: boolean;
  getRange: GetRange;
};
const enabledKeysByStep = {
  day: new Set(['m', 'm2', 'm3', 'm6', 'y', 'd30', 'd60', 'd90', 'd180', 'd365']),
  week: new Set(['m', 'm2', 'm3', 'm6', 'y']),
  'bi-week': new Set(['m', 'm2', 'm3', 'm6', 'y']),
  month: new Set(['m', 'm2', 'm3', 'm6', 'y']),
  quarter: new Set(['m', 'm2', 'm6', 'y']),
};

function getDisabled(step: string, key: string) {
  return !enabledKeysByStep[step as keyof typeof enabledKeysByStep].has(key);
}

export const getMericoDateRangeShortcuts = (step: string): Shrotcut[] => [
  {
    key: 'm',
    value: 'last month',
    group: 'last',
    disabled: getDisabled(step, 'm'),
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
    disabled: getDisabled(step, 'm2'),
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
    disabled: getDisabled(step, 'm3'),
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
    disabled: getDisabled(step, 'm6'),
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
    disabled: getDisabled(step, 'y'),
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
    disabled: getDisabled(step, 'd30'),
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
    disabled: getDisabled(step, 'd60'),
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
    disabled: getDisabled(step, 'd90'),
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
    disabled: getDisabled(step, 'd180'),
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
    disabled: getDisabled(step, 'd365'),
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

export function getMericoDateRangeShortcutValue(shortcutValue: string | null, step: string) {
  if (!shortcutValue) {
    return null;
  }

  const shortcuts = getMericoDateRangeShortcuts(step);
  const shortcut = shortcuts.find((s) => s.value === shortcutValue);
  if (shortcut) {
    return shortcut.getRange(step);
  }
  return null;
}

export function getMericoShortcutsInGroups(step: string) {
  return _.groupBy(getMericoDateRangeShortcuts(step), 'group');
}
