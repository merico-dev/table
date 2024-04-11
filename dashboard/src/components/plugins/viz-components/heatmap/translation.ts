import { TranslationPatch } from '~/types/plugin';

const en = {
  heatmap: {
    viz_name: 'Heatmap',
    click_heatmap: {
      heatblock: {
        label: 'Click heat block',
      },
    },
  },
};

const zh = {
  heatmap: {
    viz_name: '热力图',
    click_heatmap: {
      heatblock: {
        label: '点击热力块',
      },
    },
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
