import { ComboboxItem, Group, SelectProps, Text } from '@mantine/core';
type CustomItem = ComboboxItem & {
  image: string;
  label: string;
  description: string;
};

export const CustomSelectorItem: SelectProps['renderOption'] = ({ option, ...rest }) => {
  const { label, description } = option as CustomItem;
  return (
    <div {...rest}>
      <Group justify="apart" wrap="nowrap">
        <Text>{label}</Text>
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </Group>
    </div>
  );
};
