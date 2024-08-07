import { ActionIcon, Tooltip } from '@mantine/core';
import { IconMathFunction, IconMathFunctionOff } from '@tabler/icons-react';
import '@tiptap/extension-text-style';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import { ModalFunctionEditor } from '../../modal-function-editor';
import { DynamicColorAttrKey, DynamicColorName } from './dynamic-color-mark';
import { DefaultDynamicColorFunc, completeDynamicColorFunc, getDynamicColorRestrictions } from './utils';

const renderTriggerButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <Tooltip label={t('rich_text.dynamic_color.label')}>
      <ActionIcon
        variant="default"
        data-rich-text-editor-control="true"
        sx={{
          height: '26px',
          minHeight: '26px',
          lineHeight: '26px',
          borderColor: '#ced4da !important',
          color: 'rgb(190, 75, 219)',
        }}
        onClick={onClick}
      >
        <IconMathFunction stroke={2} size={16} />
      </ActionIcon>
    </Tooltip>
  );
};

export const DynamicColorControl = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const currentDynamicColor = editor.getAttributes(DynamicColorName)[DynamicColorAttrKey] ?? '';
  const value = completeDynamicColorFunc(currentDynamicColor);
  const restrictions = getDynamicColorRestrictions(currentDynamicColor);
  return (
    <>
      <ModalFunctionEditor
        title={t('rich_text.dynamic_color.edit')}
        label=""
        triggerLabel={''}
        value={value}
        onChange={(v: string) => {
          if (!v) {
            editor.chain().focus().unsetDynamicColor().run();
          } else {
            editor.chain().focus().setDynamicColor(v).run();
          }
        }}
        defaultValue={DefaultDynamicColorFunc}
        renderTriggerButton={renderTriggerButton}
        restrictions={restrictions}
        zIndex={340}
      />
      <Tooltip label={t('rich_text.dynamic_color.clear')}>
        <ActionIcon
          variant="default"
          data-rich-text-editor-control="true"
          sx={{
            height: '26px',
            minHeight: '26px',
            lineHeight: '26px',
            borderColor: '#ced4da !important',
            color: '#000',
          }}
          disabled={!currentDynamicColor}
          onClick={() => editor.chain().focus().unsetDynamicColor().run()}
        >
          <IconMathFunctionOff stroke={1.5} size={16} />
        </ActionIcon>
      </Tooltip>
    </>
  );
};
