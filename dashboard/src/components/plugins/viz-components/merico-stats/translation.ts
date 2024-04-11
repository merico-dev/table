import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_stats: {
    viz_name: 'Merico Stats',
    align_items: {
      label: 'Vertical Align',
    },
    metric: {
      labels: 'Metrics',
      metric_name: 'Metric Name',
      metric_data_field: 'Metric Data Field',
      basis_name: 'Basis Name',
      basis_data_field: 'Basis Data Field',
      others: 'Others',
      postfix_type: {
        label: 'Postfix Type',
        text: 'Text',
        filter: 'Filter Option Label',
      },
      postfix_content: 'Postfix Content',
      postfix_filter: 'Postfix Filter',
    },
  },
};

const zh = {
  merico_stats: {
    viz_name: '思码逸数据指标',
    align_items: {
      label: '垂直对齐方式',
    },
    metric: {
      labels: '指标',
      metric_name: '指标名称',
      metric_data_field: '指标数据字段',
      basis_name: '基准名',
      basis_data_field: '基准数据字段',
      others: '其他',
      postfix_type: {
        label: '后缀类型',
        text: '文本',
        filter: '筛选器选项文案',
      },
      postfix_content: '后缀文案',
      postfix_filter: '筛选器',
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
