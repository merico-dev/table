import { Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';
import { AddAPermissionRule } from './add-a-permission-rule';
import { PermissionStateAlert } from './permission-state-alert';
import { TakeOwnership } from './take-ownership';

interface IPermissionControl {
  id: string;
  refresh: () => void;
  data: DashboardPermissionDBType;
}

export const PermissionControl = observer(({ id, refresh, data }: IPermissionControl) => {
  return (
    <Stack spacing={20}>
      <Stack>
        {data.access.map((a) => (
          <Group spacing={20} key={a.id}>
            <Text>{a.id}</Text>
            <Text>{a.type}</Text>
            <Text>{a.permission}</Text>
          </Group>
        ))}
        <PermissionStateAlert data={data} />
        {data.owner_id && (
          <Group spacing={6} position="left">
            <Text size={12}>Owned by</Text>
            <Text size={12} color="dimmed">
              {data.owner_id}
            </Text>
          </Group>
        )}
      </Stack>
      <Group position="apart" mb={4}>
        <TakeOwnership id={id} refresh={refresh} />
        <AddAPermissionRule id={id} />
      </Group>
    </Stack>
  );
});
