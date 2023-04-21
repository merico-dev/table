import { Alert, Group, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';
import { AddAPermissionRule } from './add-a-permission-rule';
import { TakeOwnership } from './take-ownership';

interface IPermissionControl {
  id: string;
  data: DashboardPermissionDBType;
  uncontrolled: boolean;
}

export const PermissionControl = observer(({ id, data, uncontrolled }: IPermissionControl) => {
  return (
    <Stack spacing={20}>
      <Stack>
        {!uncontrolled &&
          data.access.map((a) => (
            <Group spacing={20} key={a.id}>
              <Text>{a.id}</Text>
              <Text>{a.type}</Text>
              <Text>{a.permission}</Text>
            </Group>
          ))}
        {uncontrolled && (
          <Alert icon={<IconAlertCircle size={16} />} color="orange">
            <Text size={14}>This dashboard is open for everyone</Text>
          </Alert>
        )}
      </Stack>
      <Group position="apart" mb={4}>
        <TakeOwnership id={id} />
        <AddAPermissionRule id={id} />
      </Group>
    </Stack>
  );
});
