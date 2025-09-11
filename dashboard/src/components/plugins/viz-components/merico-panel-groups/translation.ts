import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_panel_groups: {
    viz_name: 'Merico Panel Groups',
    render: '"Merico Panel Groups" is a ghost viz, the whole panel will not shown in dashboard',
    groups: {
      label: 'Groups',
      add: 'Add a group',
      name: 'Name',
      comment: 'Remark',
      panel_ids: 'Panels',
      yaml: {
        button: 'Import from YAML',
        modal_title: 'Import from YAML',
        label: 'YAML content',
        submit: 'Submit',
        error_title: 'Failed',
      },
    },
  },
};

const zh = {
  merico_panel_groups: {
    viz_name: '思码逸卡片组',
    render: '在使用看板时，思码逸卡片组不会参与渲染',
    groups: {
      label: '卡片组',
      add: '增加一组',
      name: '名称',
      comment: '备注',
      panel_ids: '卡片',
      yaml: {
        button: '从YAML导入',
        modal_title: '从YAML导入',
        label: 'YAML内容',
        submit: '提交',
        error_title: '解析失败',
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
