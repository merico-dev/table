import { Group, Text } from '@mantine/core';
import { PermissionModelInstance } from '../model';
import { observer } from 'mobx-react-lite';

export const DashboardOwnerInfo = observer(({ model }: { model: PermissionModelInstance }) => {
  const notOwned = !model.owner_id;
  if (notOwned) {
    return (
      <Text ta="right" size={12}>
        This dashboard is owned by no one
      </Text>
    );
  }

  return (
    <Group spacing={6} position="right">
      <Text size={12}>Owned by</Text>
      <Text size={12} color="dimmed">
        {model.owner_id}
      </Text>
    </Group>
  );
});
