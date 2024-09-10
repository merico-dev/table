import { ActionIcon, ColorPicker, Group, Popover, SimpleGrid, Stack, useMantineTheme } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconCircleOff, IconX } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorInput } from './color-input';

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

type Props = {
  value: string;
  onChange: (v: string) => void;
  clear: () => void;
  trigger: ReactNode;
};

export const ColorPickerPopover = ({ trigger, value, onChange, clear }: Props) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const [opened, { set: setOpened, setFalse: close, toggle }] = useBoolean();
  const [shouldUpdateInput, setShouldUpdateInput] = useState(false);

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
    onChange(value);
    shouldClose && close();
  };

  const handleColorInputChange = useCallback((value: string) => {
    setColor(value, false);
    setShouldUpdateInput(false);
  }, []);

  const handleColorPickerChange = useCallback((value: string) => {
    setColor(value, false);
    setShouldUpdateInput(true);
  }, []);

  const unsetColor = () => {
    clear();
    close();
  };

  return (
    <Popover opened={opened} onChange={setOpened} shadow="md" withinPortal zIndex={340} withArrow>
      <Popover.Target>
        <RichTextEditor.Control onClick={toggle}>{trigger}</RichTextEditor.Control>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack spacing="xs">
          <Group position="right">
            <ColorInput value={value} onChange={handleColorInputChange} shouldPatch={shouldUpdateInput} />
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
              value={value}
              onChange={handleColorPickerChange}
              size="sm"
              withPicker={false}
              styles={{ swatches: { marginTop: '0 !important' } }}
            />
            <ColorPicker format="hex" fullWidth value={value} onChange={handleColorPickerChange} />
          </SimpleGrid>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
