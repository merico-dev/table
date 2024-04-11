import { TranslationPatch } from '~/types/plugin';

const en = {
  cartesian_chart: {
    viz_name: 'Cartesian Chart',
    series: {
      aggregation: {
        label: 'Aggregation on Value',
      },
    },
    click_series: {
      label: 'Click bar, line or scatter',
    },
  },
};

const zh = {
  cartesian_chart: {
    viz_name: '复合图',
    series: {
      aggregation: {
        label: '聚合数据',
      },
    },
    click_series: {
      label: '点击柱、线或散点',
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
