import { TranslationPatch } from '~/types/plugin';

const en = {
  calendar_heatmap: {
    viz_name: 'Heatmap(Calendar)',
    calendar: {
      label: 'Calendar',
      locale: 'Langauge',
    },
    click_heatmap: {
      heatblock: {
        label: 'Click heat block',
      },
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
