import { TranslationPatch } from '~/types/plugin';

const en = {
  rich_text: {
    viz_name: 'Rich Text',
  },
};

const zh = {
  rich_text: {
    viz_name: '富文本',
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
