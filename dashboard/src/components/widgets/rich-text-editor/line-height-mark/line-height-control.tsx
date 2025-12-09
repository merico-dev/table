import { NativeSelect } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconLineHeight } from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import { LineHeightAttrKey, LineHeightName } from './line-height-mark';

const LINE_HEIGHTS = ['1', '1.2', '1.5', '1.75', '2', '2.5', '3'];
const LineHeightOptions = [{ label: 'auto', value: '' }].concat(
  LINE_HEIGHTS.map((s) => ({
    label: s,
    value: s,
  })),
);

const NativeSelectStyles = {
  input: {
    height: '26px',
    minHeight: '26px',
    lineHeight: '26px',
    borderColor: '#ced4da !important',
  },
};

export const LineHeightControl = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const currentLineHeight = editor.getAttributes(LineHeightName)[LineHeightAttrKey];

  return (
    <RichTextEditor.ControlsGroup>
      <NativeSelect
        size="xs"
        leftSection={<IconLineHeight stroke={1.5} size={16} />}
        data={LineHeightOptions}
        styles={NativeSelectStyles}
        value={currentLineHeight ? currentLineHeight : ''}
        title={t('rich_text.line_height.label')}
        onChange={(e) => {
          const v = e.currentTarget.value;
          if (!v) {
            editor.chain().focus().unsetLineHeight().run();
          } else {
            editor.chain().focus().setLineHeight(v).run();
          }
        }}
      />
    </RichTextEditor.ControlsGroup>
  );
};
