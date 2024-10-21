import { Box, ComboboxItem, Group, SelectProps, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';

type CustomItem = ComboboxItem & {
  label: string;
  value: string;
  aggValue: string;
  formattedValue: string;
};

export function getVariableSelectorItemRenderer(preview: 'aggregated' | 'formatted') {
  const func: SelectProps['renderOption'] = ({ option, ...others }) => {
    const { aggValue, formattedValue, label } = option as CustomItem;
    const { hovered, ref: hoverRef } = useHover();

    const defaultPreview = preview === 'aggregated' ? aggValue : formattedValue;
    const hoveredPreview = preview === 'aggregated' ? formattedValue : aggValue;
    return (
      <Box ref={hoverRef} {...others}>
        <Group wrap="nowrap" justify="space-between">
          <Text size="sm" sx={{ flexGrow: 1 }}>
            {label}
          </Text>
          <Text size="xs" opacity={hovered ? 1 : 0.65} sx={{ flexShrink: 0 }}>
            {hovered ? hoveredPreview : defaultPreview}
          </Text>
        </Group>
      </Box>
    );
  };

  return func;
}
