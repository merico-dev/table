import { TranslationPatch } from '~/types/plugin';

const en = {
  stats: {
    viz_name: 'Stats',
    click_stats: {
      trigger: 'Click stats text',
    },
  },
};

const zh = {
  stats: {
    viz_name: '数据指标',
    click_stats: {
      trigger: '点击文字',
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
