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
