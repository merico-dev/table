import { Group, Text } from '@mantine/core';
import { PermissionModelInstance } from '../model';
import { observer } from 'mobx-react-lite';

export const DashboardOwnerInfo = observer(({ model }: { model: PermissionModelInstance }) => {
  const notOwned = !model.owner_id;
  if (notOwned) {
    return (
      <Text ta="right" size={'12px'}>
        This dashboard is owned by no one
      </Text>
    );
  }

  return (
    <Group gap={6} justify="flex-end">
      <Text size={'12px'}>Owned by</Text>
      <Text size={'12px'} c="dimmed">
        {model.owner_name}
      </Text>
    </Group>
  );
});
