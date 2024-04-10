import { TranslationPatch } from '~/types/plugin';

const en = {
  button: {
    viz_name: 'Button',
    click: {
      label: 'Click this button',
    },
  },
};

const zh = {
  button: {
    viz_name: '按钮',
    click: {
      label: '点击此按钮',
    },
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
