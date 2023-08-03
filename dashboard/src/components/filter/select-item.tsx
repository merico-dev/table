import { Group, Text } from '@mantine/core';
import { forwardRef } from 'react';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  description: string;
}

export const FilterSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm" data-role="label">
            {label}
          </Text>
          <Text size="xs" color="dimmed" data-role="description">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  ),
);
