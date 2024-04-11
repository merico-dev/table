import { TranslationPatch } from '~/types/plugin';

const en = {
  funnel_chart: {
    viz_name: 'Funnel Chart',
    series_name: 'Series Name',
    level_name_field: 'Level Name Field',
    level_value_field: 'Level Value Field',
    funnel_style: 'Funnel Style',
    min_value: 'Min Value',
    min_value_checkbox_tip: 'Check to enable specific min value',
    max_value: 'Max Value',
    max_value_checkbox_tip: 'Check to enable specific max value',
    min_size: 'Min Size',
    max_size: 'Max Size',
    sort: {
      label: 'Sort',
      ascending: 'Ascending',
      descending: 'Descending',
      none: 'Use original data order',
    },
    gap: 'Gap',
    align: 'Align',
  },
};

const zh = {
  funnel_chart: {
    viz_name: '漏斗图',
    series_name: '系列名称',
    level_name_field: '层名字段',
    level_value_field: '层值字段',
    funnel_style: '漏斗样式',
    min_value: '最小值',
    min_value_checkbox_tip: '勾选以启用最小值设置',
    max_value: '最大值',
    max_value_checkbox_tip: '勾选以启用最大值设置',
    min_size: '最小尺寸',
    max_size: '最大尺寸',
    sort: {
      label: '排序',
      ascending: '升序',
      descending: '降序',
      none: '依原始数据的顺序',
    },
    gap: '间距',
    align: '对齐',
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
