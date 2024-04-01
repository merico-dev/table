import { TranslationPatch } from '~/types/plugin';

const en = {
  heatmap: {
    viz_name: 'Heatmap',
  },
};

const zh = {
  heatmap: {
    viz_name: '热力图',
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
