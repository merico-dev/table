import { TranslationPatch } from '~/types/plugin';

const en = {
  heatmap: {
    viz_name: 'Heatmap',
    click_heatmap: {
      heatblock: {
        label: 'Click heat block',
      },
    },
    pagination: {
      page_size_hint: 'Set 0 to disable pagination',
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
    pagination: {
      page_size_hint: '设为0以禁用分页',
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
