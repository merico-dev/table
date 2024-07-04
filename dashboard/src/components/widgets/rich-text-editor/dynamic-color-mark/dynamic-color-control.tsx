import { ActionIcon, Button, NativeSelect } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconMath, IconMathFunction, IconSpray, IconTextSize } from '@tabler/icons-react';
import { Extension, getMarkAttributes, Mark, mergeAttributes } from '@tiptap/core';
import '@tiptap/extension-text-style';
import { Editor } from '@tiptap/react';
import _ from 'lodash';
import { ModalFunctionEditor } from '../../modal-function-editor';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const DefaultDynamicColorFunc = ['function color({ variables }, utils) {', '    return "red";', '}'].join('\n');

const renderTriggerButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <ActionIcon
      variant="default"
      data-rich-text-editor-control="true"
      sx={{
        height: '26px',
        minHeight: '26px',
        lineHeight: '26px',
        borderColor: '#ced4da !important',
      }}
      color="grape"
      onClick={onClick}
    >
      <IconMathFunction stroke={1.5} size={16} />
    </ActionIcon>
  );
};

export const DynamicColorControl = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const [v, setV] = useState('');
  const currentDynamicColor = editor.getAttributes('dynamicColor');
  return (
    <ModalFunctionEditor
      title={t('aggregation.option.custom.title')}
      label=""
      triggerLabel={''}
      value={v}
      onChange={setV}
      defaultValue={DefaultDynamicColorFunc}
      renderTriggerButton={renderTriggerButton}
      zIndex={340}
    />
  );
};
