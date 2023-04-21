import { Group, Text } from '@mantine/core';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';

export const DashboardOwnerInfo = ({ data }: { data: DashboardPermissionDBType }) => {
  const notOwned = !data.owner_id;
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
        {data.owner_id}
      </Text>
    </Group>
  );
};
