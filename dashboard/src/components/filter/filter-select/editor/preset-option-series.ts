import { StaticOption } from '~/model/meta-model/dashboard/content/filter/widgets/select-base';

export const PresetOptionSeries: Record<string, Record<string, Array<StaticOption>>> = {
  date_unit: {
    zh: [
      {
        label: '天',
        value: 'day',
      },
      {
        label: '周',
        value: 'week',
      },
      {
        label: '双周',
        value: 'bi-week',
      },
      {
        label: '月',
        value: 'month',
      },
      {
        label: '季度',
        value: 'quarter',
      },
      {
        label: '年',
        value: 'year',
      },
    ],
    en: [
      {
        label: 'Day',
        value: 'day',
      },
      {
        label: 'Week',
        value: 'week',
      },
      {
        label: 'Bi-Week',
        value: 'bi-week',
      },
      {
        label: 'Month',
        value: 'month',
      },
      {
        label: 'Quarter',
        value: 'quarter',
      },
      {
        label: 'Year',
        value: 'year',
      },
    ],
  },
};
