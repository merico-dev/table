import { TranslationPatch } from '~/types/plugin';

const en = {
  text: {
    viz_name: 'Text',
  },
};

const zh = {
  text: {
    viz_name: '文本',
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
