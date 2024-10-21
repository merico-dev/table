import { ComboboxItem, Group, SelectProps, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
type CustomItem = ComboboxItem & {
  image: string;
  label: string;
  description: string;
};

export const CustomSelectorItem: SelectProps['renderOption'] = ({ option, checked, ...rest }) => {
  const { label, description } = option as CustomItem;
  return (
    <div {...rest} style={{ flexGrow: 1 }}>
      <Group justify="space-between" wrap="nowrap">
        <Group justify="flex-start" gap="0.5em">
          {checked && <IconCheck size={16} color="green" />}
          <Text size="sm" sx={{ flexGrow: 1 }}>
            {label}
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </Group>
    </div>
  );
};
