import { TranslationPatch } from '~/types/plugin';

const en = {
  radar_chart: {
    viz_name: 'Radar Chart',
    series: {
      series_name_field: 'Series Name Field',
    },
    metric: {
      labels: 'Metrics',
      value_formatter: 'Value Formatter',
      delete: 'Delete this Metric',
    },
    additional_series: {
      label: 'Additional Series',
      intro: 'By setting <1>Series Name Field</1>, you may add series from more queries to the chart.',
      delete: 'Delete',
    },
    style: {
      show_background: 'Show background',
      show_value_label: 'Show value label',
      color_field: 'Color Field',
    },
  },
};

const zh = {
  radar_chart: {
    viz_name: '雷达图',
    series: {
      series_name_field: '系列名字段',
    },
    metric: {
      labels: '维度',
      value_formatter: '数据格式',
      delete: '删除这个维度',
    },
    additional_series: {
      label: '扩展系列',
      intro: '在<1>系列名字段</1>中选择不同查询中的字段，从而实现图表系列的扩展',
      delete: '删除这个扩展系列',
    },
    style: {
      show_background: '显示背景',
      show_value_label: '显示标签文案',
      color_field: '颜色字段',
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
