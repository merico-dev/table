import { Text } from '@mantine/core';
import { DashboardFilterType, TDashboardStateItem } from '~/model';
import { ItemBadge } from './item-badge';

export const TextInputState = ({ item }: { item: TDashboardStateItem }) => {
  if (item.type !== DashboardFilterType.TextInput) {
    return null;
  }

  return (
    <ItemBadge
      label={item.label}
      value={
        <Text maw={200} size="xs" truncate="end" ff="monospace">
          {item.value}
        </Text>
      }
      // label_description={`filters.${item.key}`}
      value_description={item.value}
    />
  );
};
