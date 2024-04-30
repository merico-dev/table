import { TranslationPatch } from '~/types/plugin';

const en = {
  sunburst_chart: {
    viz_name: 'Sunburst Chart',
    level: {
      labels: 'Levels',
      hint: 'Configure ring style on each level',
      inside_radius: 'Inside Radius',
      outside_radius: 'Outside Radius',
      add: 'Add a level',
      delete: 'Delete this level',
    },
    label: {
      show_label_tolerance: 'Hide label when its percentage is less than...',
      rotate: {
        label: 'Rotate',
        radial: 'Radial',
        tangential: 'Tangential',
        none: 'None',
      },
    },
    group_key: 'Group Key',
  },
};

const zh = {
  sunburst_chart: {
    viz_name: '旭日图',
    level: {
      labels: '层级',
      hint: '为每层配置圆环样式',
      inside_radius: '内径',
      outside_radius: '外径',
      add: '增加一层',
      delete: '删除这一层',
    },
    label: {
      show_label_tolerance: '当百分比低于此值时，隐藏文案',
      rotate: {
        label: '旋转',
        radial: '径向旋转',
        tangential: '切向旋转',
        none: '不旋转',
      },
    },
    group_key: '分组字段',
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
