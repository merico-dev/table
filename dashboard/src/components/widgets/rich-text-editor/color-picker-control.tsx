import {
  ActionIcon,
  ColorInput,
  ColorPicker,
  ColorSwatch,
  Group,
  Popover,
  SimpleGrid,
  Stack,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconCircleOff, IconX } from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import { useBoolean } from 'ahooks';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';

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

type CustomColorInputProps = {
  value: string;
  onChange: (v: string) => void;
};

function CustomColorInput({ value, onChange }: CustomColorInputProps) {
  const [color, setColor] = useState(value);

  useEffect(() => {
    console.log('🟢 setting', value);
    setColor(value);
  }, [value]);

  useEffect(() => {}, [color]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const v = e.currentTarget.value;
    console.log('⚫️ handleChange', v);
    setColor(v);
  }, []);
  console.log('⚪️', color, ';', value);
  return (
    <TextInput
      value={color}
      onChange={handleChange}
      // onFocus={setTrue}
      // onBlur={setFalse}
      size="xs"
      styles={{
        root: {
          flexGrow: 1,
        },
        input: {
          fontFamily: 'monospace',
          letterSpacing: 2,
          textAlign: 'center',
        },
      }}
    />
  );
}

export const ColorPickerControl = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const [opened, { set: setOpened, setFalse: close, toggle }] = useBoolean();

  const _color = editor.getAttributes('textStyle').color || theme.black;
  const currentColor = useMemo(() => {
    console.log('🔵 _color', _color);
    try {
      return chroma(_color).hex();
    } catch (error) {
      return _color;
    }
  }, [_color]);

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
    console.log('🔴 setColor', value);
    shouldClose && close();
  };
  const handleColorInputChange = (value: string) => {
    setColor(value, false);
  };
  const unsetColor = () => {
    (editor.chain() as any).focus().unsetColor().run();
    close();
  };
  return (
    <Popover opened={opened} onChange={setOpened} shadow="md" withinPortal zIndex={340} withArrow trapFocus>
      <Popover.Target>
        <RichTextEditor.Control onClick={toggle}>
          <ColorSwatch color={currentColor} size={14} />
        </RichTextEditor.Control>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack spacing="xs">
          <Group position="right">
            <CustomColorInput value={currentColor} onChange={handleColorInputChange} />
            <ActionIcon variant="default" onClick={unsetColor} title={t('common.actions.clear')}>
              <IconCircleOff stroke={1.5} size="1rem" />
            </ActionIcon>
            <ActionIcon variant="default" onClick={close} title={t('common.actions.close')}>
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
