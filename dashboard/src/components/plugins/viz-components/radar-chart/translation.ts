import { TranslationPatch } from '~/types/plugin';

const en = {
  radar_chart: {
    viz_name: 'Radar Chart',
  },
};

const zh = {
  radar_chart: {
    viz_name: '雷达图',
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
