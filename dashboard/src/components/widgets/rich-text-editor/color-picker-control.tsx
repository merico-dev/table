import {
  ActionIcon,
  ColorInput,
  ColorPicker,
  ColorSwatch,
  Group,
  Popover,
  SimpleGrid,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconCircleOff, IconX } from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import { useBoolean } from 'ahooks';
import { useMemo } from 'react';

const swatchNames = [
  // 'dark',
  'gray',
  'red',
  // 'pink',
  'grape',
  // 'violet',
  // 'indigo',
  'blue',
  'cyan',
  // 'teal',
  'green',
  // 'lime',
  'yellow',
  // 'orange',
];

export const ColorPickerControl = ({ editor }: { editor: Editor }) => {
  const theme = useMantineTheme();
  const [opened, { set: setOpened, setFalse: close, toggle }] = useBoolean();
  const currentColor = editor.getAttributes('textStyle').color || theme.black;

  const swatches = useMemo(() => {
    const ret: string[] = [];
    swatchNames.forEach((name) => {
      const colors = theme.colors[name];
      if (!colors) {
        return;
      }
      colors.forEach((color) => {
        ret.push(color);
      });
    });
    return ret;
  }, [theme.colors]);

  const setColor = (value: string, shouldClose = true) => {
    (editor.chain() as any).focus().setColor(value).run();
    shouldClose && close();
  };
  const unsetColor = () => {
    (editor.chain() as any).focus().unsetColor().run();
    close();
  };

  return (
    <Popover opened={opened} onChange={setOpened} shadow="md" withinPortal zIndex={340} withArrow>
      <Popover.Target>
        <RichTextEditor.Control onClick={toggle}>
          <ColorSwatch color={currentColor} size={14} />
        </RichTextEditor.Control>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack spacing="xs">
          <Group position="right">
            <ColorInput
              value={currentColor}
              onChange={(value) => setColor(value, false)}
              size="xs"
              withPicker={false}
              dropdownZIndex={340}
              sx={{ flexGrow: 1, fontFamily: 'monospace' }}
            />
            <ActionIcon variant="default" onClick={unsetColor} title="clear">
              <IconCircleOff stroke={1.5} size="1rem" />
            </ActionIcon>
            <ActionIcon variant="default" onClick={close} title="close">
              <IconX stroke={1.5} size="1rem" />
            </ActionIcon>
          </Group>
          <SimpleGrid cols={2}>
            <ColorPicker
              format="hex"
              swatches={swatches}
              value={currentColor}
              onChange={(value) => setColor(value, false)}
              size="sm"
              withPicker={false}
              styles={{ swatches: { marginTop: '0 !important' } }}
            />
            <ColorPicker format="hex" fullWidth value={currentColor} onChange={(value) => setColor(value, false)} />
          </SimpleGrid>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
