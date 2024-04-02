import { TranslationPatch } from '~/types/plugin';

const en = {
  cartesian_chart: {
    viz_name: 'Cartesian Chart',
    series: {
      aggregation: {
        label: 'Aggregation on Value',
      },
      group_by: {
        label: 'Split into multiple seires by this field...',
      },
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
      group_by: {
        label: '按此字段拆分为多个系列',
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
