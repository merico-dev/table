import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_heatmap: {
    viz_name: 'Merico Heatmap',
  },
};

const zh = {
  merico_heatmap: {
    viz_name: '思码逸热力图',
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
