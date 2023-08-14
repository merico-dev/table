import { Group, Stack, Text } from '@mantine/core';
import { forwardRef } from 'react';
interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  description: string;
}

export const CustomSelectorItem = forwardRef<HTMLDivElement, ItemProps>((props: ItemProps, ref) => {
  const { label, description, ...rest } = props;
  return (
    <div ref={ref} {...rest}>
      <Group position="apart" noWrap>
        <Text>{label}</Text>
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      </Group>
    </div>
  );
});
