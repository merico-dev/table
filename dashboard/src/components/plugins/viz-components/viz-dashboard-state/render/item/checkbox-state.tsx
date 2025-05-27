import { ThemeIcon } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { DashboardFilterType, TDashboardStateItem } from '~/model';
import { ItemBadge } from './item-badge';

export const CheckboxState = ({ item }: { item: TDashboardStateItem }) => {
  if (item.type !== DashboardFilterType.Checkbox) {
    return null;
  }

  return (
    <ItemBadge
      label={item.label}
      value={
        <ThemeIcon variant="white" radius="xs" color={item.value ? 'teal' : 'red'} w={12} h={12} miw={12} mih={12}>
          {item.value ? <IconCheck size={12} strokeWidth={3} /> : <IconX strokeWidth={3} />}
        </ThemeIcon>
      }
    />
  );
};
