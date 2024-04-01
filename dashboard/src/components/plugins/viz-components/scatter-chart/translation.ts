import { TranslationPatch } from '~/types/plugin';

const en = {
  scatter_chart: {
    viz_name: 'Scatter Chart',
  },
};

const zh = {
  scatter_chart: {
    viz_name: '散点图',
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
