import '@tiptap/extension-text-style';
import { Editor } from '@tiptap/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GradientColorName } from './gradient-color-mark';
import { parseGradientColorAttrs } from './utils';
import { ActionIcon, Box, Popover, Tooltip, useMantineTheme } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { RichTextEditor } from '@mantine/tiptap';
import { ChartTheme } from '~/styles/register-themes';

const IconGradientColor = () => {
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
const IconGradientColorOff = () => {
  const theme = useMantineTheme();
  return (
    <Box
      sx={{
        width: '16px',
        height: '10px',
        borderRadius: '2px',
        background: theme.fn.linearGradient(90, ...Object.values(ChartTheme.graphics.depth)),
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
             rgba(0,0,0,0) calc(50% - 0.8px),
             rgba(0,0,0,1) 50%,
             rgba(0,0,0,0) calc(50% + 0.8px),
             rgba(0,0,0,0) 100%)`,
        },
      }}
    />
  );
};

export const GradientColorControl = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const [opened, { set: setOpened, setTrue: open, setFalse: close, toggle }] = useBoolean();
  const attrs = editor.getAttributes(GradientColorName);
  const defaultValue = useMemo(() => {
    return parseGradientColorAttrs(attrs);
  }, [attrs]);
  console.log(defaultValue);
  return (
    <Popover opened={opened} onChange={setOpened} shadow="md" withinPortal zIndex={340} withArrow>
      <Popover.Target>
        <RichTextEditor.ControlsGroup>
          <Tooltip label={t('rich_text.gradient_color.label')}>
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
              <IconGradientColor />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('rich_text.gradient_color.clear')}>
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
              // disabled={!gradientColorConfigured}
              onClick={() => editor.chain().focus().unsetDynamicColor().run()}
            >
              <IconGradientColorOff />
            </ActionIcon>
          </Tooltip>
        </RichTextEditor.ControlsGroup>
      </Popover.Target>

      <Popover.Dropdown>TODO</Popover.Dropdown>
    </Popover>
  );
};
