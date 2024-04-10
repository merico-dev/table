import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_heatmap: {
    viz_name: 'Merico Heatmap',
    click_heatmap: {
      heatblock: {
        label: 'Click heat block',
      },
    },
  },
};

const zh = {
  merico_heatmap: {
    viz_name: '思码逸热力图',
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
