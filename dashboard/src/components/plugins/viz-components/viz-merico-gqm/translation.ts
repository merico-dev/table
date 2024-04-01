import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_gqm: {
    viz_name: 'Merico GQM',
  },
};

const zh = {
  merico_gqm: {
    viz_name: '思码逸GQM组件',
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
