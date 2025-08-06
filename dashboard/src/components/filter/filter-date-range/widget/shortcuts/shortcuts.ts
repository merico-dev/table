import dayjs from 'dayjs';
import _ from 'lodash';
import { DateRangeValue } from '~/model';

export type GetRange = () => DateRangeValue;
type Shrotcut = {
  key: string;
  value: string;
  group: 'last' | 'recent' | 'this' | 'this_so_far';
  getRange: GetRange;
};

export const getDateRangeShortcuts = (): Shrotcut[] => [
  {
    key: 'd',
    value: 'yesterday',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(1, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'yesterday',
      };
    },
  },
  {
    key: 'w',
    value: 'last week',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(1, 'week').startOf('week').toDate(),
          dayjs(now).subtract(1, 'week').endOf('week').toDate(),
        ],
        shortcut: 'last week',
      };
    },
  },
  {
    key: 'm',
    value: 'last month',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(1, 'month').startOf('month').toDate(),
          dayjs(now).subtract(1, 'month').endOf('month').toDate(),
        ],
        shortcut: 'last month',
      };
    },
  },
  {
    key: 'm2',
    value: 'last 2 months',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(2, 'month').startOf('month').toDate(),
          dayjs(now).subtract(1, 'month').endOf('month').toDate(),
        ],
        shortcut: 'last 2 months',
      };
    },
  },
  {
    key: 'm3',
    value: 'last 3 months',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(3, 'month').startOf('month').toDate(),
          dayjs(now).subtract(1, 'month').endOf('month').toDate(),
        ],
        shortcut: 'last 3 months',
      };
    },
  },
  {
    key: 'y',
    value: 'last year',
    group: 'last',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(1, 'year').startOf('year').toDate(),
          dayjs(now).subtract(1, 'year').endOf('year').toDate(),
        ],
        shortcut: 'last year',
      };
    },
  },
  {
    key: 'd7',
    value: 'recent 7 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(7, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 7 days',
      };
    },
  },
  {
    key: 'd30',
    value: 'recent 30 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(30, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 30 days',
      };
    },
  },
  {
    key: 'd60',
    value: 'recent 60 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(60, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 60 days',
      };
    },
  },
  {
    key: 'd90',
    value: 'recent 90 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(90, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 90 days',
      };
    },
  },
  {
    key: 'd180',
    value: 'recent 180 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(180, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 180 days',
      };
    },
  },
  {
    key: 'd365',
    value: 'recent 365 days',
    group: 'recent',
    getRange: () => {
      const now = Date.now();
      return {
        value: [
          dayjs(now).subtract(365, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ],
        shortcut: 'recent 365 days',
      };
    },
  },
  {
    key: 'd',
    value: 'today',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return { value: [dayjs(now).startOf('day').toDate(), dayjs(now).endOf('day').toDate()], shortcut: 'today' };
    },
  },
  {
    key: 'w',
    value: 'this week',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return { value: [dayjs(now).startOf('week').toDate(), dayjs(now).endOf('week').toDate()], shortcut: 'this week' };
    },
  },
  {
    key: 'm',
    value: 'this month',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return {
        value: [dayjs(now).startOf('month').toDate(), dayjs(now).endOf('month').toDate()],
        shortcut: 'this month',
      };
    },
  },
  {
    key: 'y',
    value: 'this year',
    group: 'this',
    getRange: () => {
      const now = Date.now();
      return { value: [dayjs(now).startOf('year').toDate(), dayjs(now).endOf('year').toDate()], shortcut: 'this year' };
    },
  },
  {
    key: 'w',
    value: 'this week so far',
    group: 'this_so_far',
    getRange: () => {
      const now = Date.now();
      return {
        value: [dayjs(now).startOf('week').toDate(), dayjs(now).endOf('day').toDate()],
        shortcut: 'this week so far',
      };
    },
  },
  {
    key: 'm',
    value: 'this month so far',
    group: 'this_so_far',
    getRange: () => {
      const now = Date.now();
      return {
        value: [dayjs(now).startOf('month').toDate(), dayjs(now).endOf('day').toDate()],
        shortcut: 'this month so far',
      };
    },
  },
  {
    key: 'y',
    value: 'this year so far',
    group: 'this_so_far',
    getRange: () => {
      const now = Date.now();
      return {
        value: [dayjs(now).startOf('year').toDate(), dayjs(now).endOf('day').toDate()],
        shortcut: 'this year so far',
      };
    },
  },
];

export function getDateRangeShortcutValue(shortcutValue: string | null) {
  if (!shortcutValue) {
    return null;
  }

  const shortcuts = getDateRangeShortcuts();
  const shortcut = shortcuts.find((s) => s.value === shortcutValue);
  if (shortcut) {
    return shortcut.getRange();
  }
  return null;
}

export function getShortcutsInGroups() {
  return _.groupBy(getDateRangeShortcuts(), 'group');
}
