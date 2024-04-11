import { TranslationPatch } from '~/types/plugin';

const en = {
  scatter_chart: {
    viz_name: 'Scatter Chart',
    color: {
      type: {
        static: 'Static',
        dynamic: 'Dynamic',
      },
      dynamic: {
        setup: 'Setup',
        setup_title: 'Setup dynamic color',
      },
    },
    click_scatter: {
      trigger: 'Click Scatter',
    },
  },
};

const zh = {
  scatter_chart: {
    viz_name: '散点图',
    color: {
      type: {
        static: '具体颜色',
        dynamic: '动态计算颜色',
      },
      dynamic: {
        setup: '设置',
        setup_title: '设置动态计算颜色的逻辑',
      },
    },
    click_scatter: {
      trigger: '点击散点',
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
