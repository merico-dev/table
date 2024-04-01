import { TranslationPatch } from '~/types/plugin';

const en = {
  regression_chart: {
    viz_name: 'Regression Chart',
  },
};

const zh = {
  regression_chart: {
    viz_name: '回归分析图',
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
