import { TranslationPatch } from '~/types/plugin';

const en = {
  button: {
    viz_name: 'Button',
  },
};

const zh = {
  button: {
    viz_name: '按钮',
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
