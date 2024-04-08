import { TranslationPatch } from '~/types/plugin';

const en = {
  rich_text: {
    viz_name: 'Rich Text',
    content: {
      label: 'Content',
    },
  },
};

const zh = {
  rich_text: {
    viz_name: '富文本',
    content: {
      label: '内容',
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
