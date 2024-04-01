import { TranslationPatch } from '~/types/plugin';

const en = {
  horizontal_bar_chart: {
    viz_name: 'Horizontal Bar Chart',
  },
};

const zh = {
  horizontal_bar_chart: {
    viz_name: '水平方向柱图',
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
