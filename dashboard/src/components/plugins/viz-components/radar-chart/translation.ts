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
      add: 'Add a metric',
      delete: 'Delete this metric',
    },
    additional_series: {
      label: 'Additional Series',
      intro: 'By setting <1>Series Name Field</1>, you may add series from more queries to the chart.',
      add: 'Add a series',
      delete: 'Delete',
    },
    style: {
      show_background: 'Show background',
      show_value_label: 'Show value label',
      color_field: 'Color Field',
    },
    click_series: {
      label: 'Click radar chart series',
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
      add: '增加一个维度',
      delete: '删除这个维度',
    },
    additional_series: {
      label: '扩展系列',
      intro: '在<1>系列名字段</1>中选择不同查询中的字段，从而实现图表系列的扩展',
      add: '增加一个扩展系列',
      delete: '删除这个扩展系列',
    },
    style: {
      show_background: '显示背景',
      show_value_label: '显示标签文案',
      color_field: '颜色字段',
    },
    click_series: {
      label: '点击雷达系列',
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
