import { TranslationPatch } from '~/types/plugin';

const en = {
  pie_chart: {
    viz_name: 'Pie Chart',
    click_series: {
      label: 'Click pie series',
    },
    radius: {
      label: 'Radius',
      inner: 'Inner',
      outer: 'Outer',
    },
  },
};

const zh = {
  pie_chart: {
    viz_name: '饼图',
    click_series: {
      label: '点击饼瓣',
    },
    radius: {
      label: '内外半径',
      inner: '内',
      outer: '外',
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
