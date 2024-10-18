import { CheckIcon, ColorSwatch, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { useCallback } from 'react';

interface IMantineColorSwatches {
  value: string;
  onChange: (v: string) => void;
  label: string;
}

export const MantineColorSwatches = ({ value, onChange, label }: IMantineColorSwatches) => {
  const theme = useMantineTheme();

  const getClickHandler = useCallback(
    (colorName: string) => {
      return () => onChange(colorName);
    },
    [onChange],
  );

  const isColorChecked = (colorName: string) => value === colorName;
  return (
    <Stack gap={2}>
      <Text size={'14px'} fw={500}>
        {label}
      </Text>
      <Group justify="flex-start" gap="xs">
        {Object.keys(theme.colors).map((colorName) => {
          const colorValue = theme.colors[colorName][6];
          return (
            <ColorSwatch
              key={colorName}
              color={colorValue}
              onClick={getClickHandler(colorName)}
              radius={4}
              size={26}
              sx={{ cursor: 'pointer' }}
            >
              {isColorChecked(colorName) && <CheckIcon width={10} color="white" />}
            </ColorSwatch>
          );
        })}
      </Group>
    </Stack>
  );
};
