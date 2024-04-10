import { TranslationPatch } from '~/types/plugin';

const en = {
  calendar_heatmap: {
    viz_name: 'Heatmap(Calendar)',
    calendar: {
      label: 'Calendar',
      locale: 'Langauge',
    },
    heatblock: {
      min_value: 'Min Value',
      max_value: 'Max Value',
    },
  },
};

const zh = {
  calendar_heatmap: {
    viz_name: '日历热力图',
    calendar: {
      label: '日历',
      locale: '语言',
    },
    heatblock: {
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
