import { TranslationPatch } from '~/types/plugin';

const en = {
  rich_text: {
    viz_name: 'Rich Text',
    click: {
      label: 'Click Rich Text Block',
      block_id_label: 'Block ID',
      block_id_description: 'Optional identifier for the clicked block',
      block_id_placeholder: 'Enter block ID',
      click_block_with_id: 'Click Rich Text Block: {{blockId}}',
    },
  },
};

const zh = {
  rich_text: {
    viz_name: '富文本',
    click: {
      label: '点击富文本块',
      block_id_label: '块ID',
      block_id_description: '被点击块的可选标识符',
      block_id_placeholder: '输入块ID',
      click_block_with_id: '点击富文本块: {{blockId}}',
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
