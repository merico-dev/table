import { Box, Group, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { forwardRef } from 'react';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
  aggValue: string;
  formattedValue: string;
}

export const VariableSelectorItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ aggValue, formattedValue, label, ...others }: ItemProps, ref) => {
    const { hovered, ref: hoverRef } = useHover();

    return (
      <Box ref={hoverRef} {...others}>
        <Group noWrap position="apart" ref={ref}>
          <Text size="sm" sx={{ flexGrow: 1 }}>
            {label}
          </Text>
          <Text size="xs" opacity={hovered ? 1 : 0.65} sx={{ flexShrink: 0 }}>
            {hovered ? aggValue : formattedValue}
          </Text>
        </Group>
      </Box>
    );
  },
);
