import { TranslationPatch } from '~/types/plugin';

const en = {
  text: {
    viz_name: 'Text',
    content: {
      label: 'Text content',
      edit: 'Edit Content',
    },
  },
};

const zh = {
  text: {
    viz_name: '文本',
    content: {
      label: '文本内容',
      edit: '编辑文本内容',
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
