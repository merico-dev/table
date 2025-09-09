import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_panel_groups: {
    viz_name: 'Merico Panel Groups',
    groups: {
      label: 'Groups',
      add: 'Add a group',
      name: 'Name',
      comment: 'Remark',
      panel_ids: 'Panels',
    },
  },
};

const zh = {
  merico_panel_groups: {
    viz_name: '思码逸卡片组',
    groups: {
      label: '卡片组',
      add: '增加一组',
      name: '名称',
      comment: '备注',
      panel_ids: '卡片',
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
