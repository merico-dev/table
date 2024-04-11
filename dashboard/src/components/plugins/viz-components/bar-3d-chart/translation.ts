import { TranslationPatch } from '~/types/plugin';

const en = {
  bar_chart_3d: {
    viz_name: 'Bar Chart(3D)',
  },
};

const zh = {
  bar_chart_3d: {
    viz_name: '柱图（3D）',
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
