import { TranslationPatch } from '~/types/plugin';

const en = {
  cartesian_chart: {
    viz_name: 'Cartesian Chart',
  },
};

const zh = {
  cartesian_chart: {
    viz_name: '复合图',
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
