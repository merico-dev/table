import { Alert, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';

export const PermissionStateAlert = ({ data }: { data: DashboardPermissionDBType }) => {
  const uncontrolled = data?.access.length === 0;
  const notOwned = !data.owner_id;
  if (!uncontrolled && !notOwned) {
    return null;
  }
  return (
    <Alert icon={<IconAlertCircle size={16} />} color="orange">
      {notOwned && <Text size={14}>This dashboard is owned by no one</Text>}
      {uncontrolled && <Text size={14}>This dashboard is open for everyone</Text>}
    </Alert>
  );
};
