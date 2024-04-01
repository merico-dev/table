import { TranslationPatch } from '~/types/plugin';

const en = {
  sunburst_chart: {
    viz_name: 'Sunburst Chart',
  },
};

const zh = {
  sunburst_chart: {
    viz_name: '旭日图',
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
