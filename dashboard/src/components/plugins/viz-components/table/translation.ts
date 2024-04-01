import { TranslationPatch } from '~/types/plugin';

const en = {
  table: {
    viz_name: 'Table',
  },
};

const zh = {
  table: {
    viz_name: '表格',
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
