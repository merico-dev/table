import { TranslationPatch } from '~/types/plugin';

const en = {
  vizDashboardState: {
    viz_name: 'Dashboard State',
    show_all: 'Show all filters and context entries',
    variable_selector: {
      label: 'Select filters and context entries to show',
      placeholder: '',
    },
  },
};

const zh = {
  vizDashboardState: {
    viz_name: '看板状态',
    show_all: '显示所有筛选器和上下文条目',
    variable_selector: {
      label: '选择要展示的筛选器和上下文',
      placeholder: '',
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
