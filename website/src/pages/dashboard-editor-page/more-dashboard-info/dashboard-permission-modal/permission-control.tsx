import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';

interface IPermissionControl {
  data: DashboardPermissionDBType;
  uncontrolled: boolean;
}

export const PermissionControl = observer(({ data, uncontrolled }: IPermissionControl) => {
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
      <Group position="right">
        <Button size="xs" variant="light" leftIcon={<IconPlus size={14} />}>
          Add a rule
        </Button>
      </Group>
    </Stack>
  );
});
