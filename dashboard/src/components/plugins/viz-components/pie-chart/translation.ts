import { TranslationPatch } from '~/types/plugin';

const en = {
  pie_chart: {
    viz_name: 'Pie Chart',
    click_series: {
      label: 'Click pie series',
    },
  },
};

const zh = {
  pie_chart: {
    viz_name: '饼图',
    click_series: {
      label: '点击饼瓣',
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
