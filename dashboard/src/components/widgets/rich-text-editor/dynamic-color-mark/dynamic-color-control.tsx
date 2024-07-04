import { ActionIcon } from '@mantine/core';
import { IconMathFunction } from '@tabler/icons-react';
import '@tiptap/extension-text-style';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalFunctionEditor } from '../../modal-function-editor';
import { DynamicColorAttrKey, DynamicColorName } from './dynamic-color-mark';
import { DefaultDynamicColorFunc } from './utils';

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
  const currentDynamicColor = editor.getAttributes(DynamicColorName)[DynamicColorAttrKey] ?? '';
  return (
    <ModalFunctionEditor
      title={t('aggregation.option.custom.title')}
      label=""
      triggerLabel={''}
      value={currentDynamicColor}
      onChange={(v: string) => {
        if (!v) {
          editor.chain().focus().unsetDynamicColor().run();
        } else {
          editor.chain().focus().setDynamicColor(v).run();
        }
      }}
      defaultValue={DefaultDynamicColorFunc}
      renderTriggerButton={renderTriggerButton}
      zIndex={340}
    />
  );
};
