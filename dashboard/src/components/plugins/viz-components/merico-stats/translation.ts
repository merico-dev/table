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
    click_merico_stats: {
      trigger: 'Click Merico Stats',
      trigger_with_name: 'Click Merico Stats: {{name}}',
      metric_name_label: 'Metric Name',
      metric_name_placeholder: 'Leave empty to match all metrics',
      metric_name_description:
        'Only trigger when clicking a metric with this name. Leave empty to trigger for any metric.',
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
    click_merico_stats: {
      trigger: '点击思码逸数据指标',
      trigger_with_name: '点击思码逸数据指标: {{name}}',
      metric_name_label: '指标名称',
      metric_name_placeholder: '留空以匹配所有指标',
      metric_name_description: '仅在点击具有此名称的指标时触发。留空则对任何指标触发。',
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
