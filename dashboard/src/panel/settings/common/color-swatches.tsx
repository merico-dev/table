import { CheckIcon, ColorSwatch, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { useCallback } from 'react';

interface IColorSwatches {
  value: string;
  onChange: (v: string) => void;
  label: string;
}

export const ColorSwatches = ({ value, onChange, label }: IColorSwatches) => {
  const theme = useMantineTheme();

  const getClickHandler = useCallback(
    (colorName: string) => {
      return () => onChange(colorName);
    },
    [onChange],
  );

  const isColorChecked = (colorName: string) => value === colorName;
  return (
    <Stack spacing={2}>
      <Text size={14} sx={{ fontWeight: 500 }}>
        {label}
      </Text>
      <Group position="left" spacing="xs">
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
