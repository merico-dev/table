import { TranslationPatch } from '~/types/plugin';

const en = {
  stats: {
    viz_name: 'Stats',
  },
};

const zh = {
  stats: {
    viz_name: '数据指标',
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
