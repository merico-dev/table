import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_stats: {
    viz_name: 'Merico Stats',
  },
};

const zh = {
  merico_stats: {
    viz_name: '思码逸数据指标',
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
