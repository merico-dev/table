import { Box, Group, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { forwardRef } from 'react';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
  aggValue: string;
  formattedValue: string;
  preview: 'aggregated' | 'formatted';
}

export const VariableSelectorItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ aggValue, formattedValue, label, preview, ...others }: ItemProps, ref) => {
    const { hovered, ref: hoverRef } = useHover();

    const defaultPreview = preview === 'aggregated' ? aggValue : formattedValue;
    const hoveredPreview = preview === 'aggregated' ? formattedValue : aggValue;
    return (
      <Box ref={hoverRef} {...others}>
        <Group wrap="nowrap" justify="apart" ref={ref}>
          <Text size="sm" sx={{ flexGrow: 1 }}>
            {label}
          </Text>
          <Text size="xs" opacity={hovered ? 1 : 0.65} sx={{ flexShrink: 0 }}>
            {hovered ? hoveredPreview : defaultPreview}
          </Text>
        </Group>
      </Box>
    );
  },
);
