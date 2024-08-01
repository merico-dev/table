import { ActionIcon, Box, Modal, Tooltip, useMantineTheme } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import '@tiptap/extension-text-style';
import { Editor } from '@tiptap/react';
import { useBoolean } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartTheme } from '~/styles/register-themes';
import { ColorMappingForm, ColorMappingFormValues } from './color-mapping-form';
import { ColorMappingName } from './color-mapping-mark';
import { parseColorMappingAttrs } from './utils';

const IconColorMapping = () => {
  const theme = useMantineTheme();
  return (
    <div
      style={{
        width: '20px',
        height: '13px',
        borderRadius: '2px',
        background: theme.fn.linearGradient(90, ...Object.values(ChartTheme.graphics.depth)),
      }}
    />
  );
};
const IconColorMappingOff = ({ disabled }: { disabled: boolean }) => {
  const theme = useMantineTheme();
  return (
    <Box
      sx={{
        width: '16px',
        height: '10px',
        borderRadius: '2px',
        background: theme.fn.linearGradient(90, ...Object.values(ChartTheme.graphics.depth)),
        opacity: disabled ? '0.5' : 1,
        position: 'relative',
        '&:after': {
          position: 'absolute',
          content: "''",
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '15px',
          height: '15px',
          background: `
          linear-gradient(to top right,
             rgba(0,0,0,0) 0%,
             rgba(0,0,0,0) calc(50% - 1.4px),
             rgba(255,255,255,1) calc(50% - 1.4px),
             rgba(0,0,0,0) calc(50% - 0.8px),
             rgba(0,0,0,1) 50%,
             rgba(0,0,0,0) calc(50% + 0.8px),
             rgba(255,255,255,1) calc(50% + 1.4px),
             rgba(0,0,0,0) calc(50% + 1.4px),
             rgba(0,0,0,0) 100%)`,
        },
      }}
    />
  );
};

export const ColorMappingControl = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const [opened, { set: setOpened, setTrue: open, setFalse: close, toggle }] = useBoolean();
  const attrs = editor.getAttributes(ColorMappingName);
  const defaultValues = useMemo(() => {
    return parseColorMappingAttrs(attrs);
  }, [attrs]);
  const saveChanges = useCallback(
    (values: ColorMappingFormValues) => {
      editor.chain().focus().setColorMapping(values).run();
      close();
    },
    [editor],
  );
  const unset = useCallback(() => {
    editor.chain().focus().unsetColorMapping().run();
  }, [editor]);

  console.log(defaultValues);

  return (
    <>
      <Modal
        size={500}
        opened={opened}
        onClose={close}
        shadow="md"
        withinPortal
        zIndex={340}
        closeOnClickOutside={false}
        closeOnEscape={false}
        title={t('rich_text.color_mapping.edit')}
        styles={{
          header: {
            paddingBottom: 0,
          },
          body: {
            padding: 0,
          },
        }}
      >
        <ColorMappingForm defaultValues={defaultValues} cancel={close} unset={unset} onSubmit={saveChanges} />
      </Modal>
      <RichTextEditor.ControlsGroup>
        <Tooltip label={t('rich_text.color_mapping.label')}>
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
            onClick={open}
          >
            <IconColorMapping />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={t('rich_text.color_mapping.clear')}>
          <ActionIcon
            variant="default"
            data-rich-text-editor-control="true"
            sx={{
              height: '26px',
              minHeight: '26px',
              lineHeight: '26px',
              borderColor: '#ced4da !important',
            }}
            disabled={defaultValues.empty}
            onClick={unset}
          >
            <IconColorMappingOff disabled={defaultValues.empty} />
          </ActionIcon>
        </Tooltip>
      </RichTextEditor.ControlsGroup>
    </>
  );
};
