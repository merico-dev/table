import { TranslationPatch } from '~/types/plugin';

const en = {
  funnel_chart: {
    viz_name: 'Funnel Chart',
  },
};

const zh = {
  funnel_chart: {
    viz_name: '漏斗图',
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
