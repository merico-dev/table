import dayjs from 'dayjs';
import { DateRangeValue } from '../type';

export type GetRange = () => DateRangeValue;
type Shrotcut = {
  label: string;
  value: string;
  getRange: GetRange;
};

export const shortcutGroups: { last: Shrotcut[]; recent: Shrotcut[]; this: Shrotcut[] } = {
  last: [
    {
      label: 'yesterday',
      value: 'yesterday',
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
      getRange: () => {
        const now = Date.now();
        return [
          dayjs(now).subtract(1, 'year').startOf('year').toDate(),
          dayjs(now).subtract(1, 'year').endOf('year').toDate(),
        ];
      },
    },
  ],
  recent: [
    {
      label: '7 days',
      value: 'recent 7 days',
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
      getRange: () => {
        const now = Date.now();
        return [
          dayjs(now).subtract(365, 'day').startOf('day').toDate(),
          dayjs(now).subtract(1, 'day').endOf('day').toDate(),
        ];
      },
    },
  ],
  this: [
    {
      label: 'today',
      value: 'today',
      getRange: () => {
        const now = Date.now();
        return [dayjs(now).startOf('day').toDate(), dayjs(now).endOf('day').toDate()];
      },
    },
    {
      label: 'week',
      value: 'this week',
      getRange: () => {
        const now = Date.now();
        return [dayjs(now).startOf('week').toDate(), dayjs(now).endOf('week').toDate()];
      },
    },
    {
      label: 'month',
      value: 'this month',
      getRange: () => {
        const now = Date.now();
        return [dayjs(now).startOf('month').toDate(), dayjs(now).endOf('month').toDate()];
      },
    },
    {
      label: '2 months',
      value: 'this 2 months',
      getRange: () => {
        const now = Date.now();
        return [dayjs(now).startOf('month').toDate(), dayjs(now).add(1, 'month').endOf('week').toDate()];
      },
    },
    {
      label: '3 months',
      value: 'this 3 months',
      getRange: () => {
        const now = Date.now();
        return [dayjs(now).startOf('month').toDate(), dayjs(now).add(2, 'month').endOf('week').toDate()];
      },
    },
    {
      label: 'year',
      value: 'this year',
      getRange: () => {
        const now = Date.now();
        return [dayjs(now).startOf('year').toDate(), dayjs(now).endOf('year').toDate()];
      },
    },
  ],
};
