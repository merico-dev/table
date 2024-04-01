import { TranslationPatch } from '~/types/plugin';

const en = {
  pareto_chart: {
    viz_name: 'Pareto Chart',
  },
};

const zh = {
  pareto_chart: {
    viz_name: '帕累托图',
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
