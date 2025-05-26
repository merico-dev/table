import { TranslationPatch } from '~/types/plugin';

const en = {
  vizDashboardState: {
    viz_name: 'Dashboard State',
  },
};

const zh = {
  vizDashboardState: {
    viz_name: '看板状态',
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
