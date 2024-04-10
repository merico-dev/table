import { TranslationPatch } from '~/types/plugin';

const en = {
  heatmap: {
    viz_name: 'Heatmap',
    heatblock: {
      show_label: 'Show Label',
      min_value: 'Min Value',
      max_value: 'Max Value',
    },
  },
};

const zh = {
  heatmap: {
    viz_name: '热力图',
    heatblock: {
      show_label: '展示值文案',
      min_value: '最小值',
      max_value: '最大值',
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
