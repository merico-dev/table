import { TranslationPatch } from '~/types/plugin';

const en = {
  horizontal_bar_chart: {
    viz_name: 'Horizontal Bar Chart',
    series: {
      aggregation: {
        label: 'Aggregation on Value',
      },
    },
  },
};

const zh = {
  horizontal_bar_chart: {
    viz_name: '水平方向柱图',
    series: {
      aggregation: {
        label: '聚合数据',
      },
    },
  },
};

export const translation: TranslationPatch = [
  {
    lang: 'en',
    resources: en,
  },
  {
    lang: 'zh',
    resources: zh,
  },
];
