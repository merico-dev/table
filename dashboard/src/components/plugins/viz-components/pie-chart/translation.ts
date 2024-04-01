import { TranslationPatch } from '~/types/plugin';

const en = {
  pie_chart: {
    viz_name: 'Pie Chart',
  },
};

const zh = {
  pie_chart: {
    viz_name: '饼图',
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
