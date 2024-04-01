import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_estimation_chart: {
    viz_name: 'Merico Estimation Chart',
  },
};

const zh = {
  merico_estimation_chart: {
    viz_name: '思码逸估算分析图',
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
