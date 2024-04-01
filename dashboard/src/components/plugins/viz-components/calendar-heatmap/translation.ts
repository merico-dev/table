import { TranslationPatch } from '~/types/plugin';

const en = {
  calendar_heatmap: {
    viz_name: 'Heatmap(Calendar)',
  },
};

const zh = {
  calendar_heatmap: {
    viz_name: '日历热力图',
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
