import { ComboboxItem, Group, SelectProps, Text } from '@mantine/core';

type CustomItem = ComboboxItem & {
  label: string;
  description: string;
};

export const FilterSelectItem: SelectProps['renderOption'] = ({ option, ...others }) => {
  const { label, description } = option as CustomItem;
  return (
    <div {...others}>
      <Group wrap="nowrap">
        <div>
          <Text size="sm" data-role="label">
            {label}
          </Text>
          <Text size="xs" c="dimmed" data-role="description">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  );
};
