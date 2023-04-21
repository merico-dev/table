import { Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';
import { AddAPermissionRule } from './add-a-permission-rule';
import { PermissionStateAlert } from './permission-state-alert';
import { TakeOwnership } from './take-ownership';

interface IPermissionControl {
  id: string;
  data: DashboardPermissionDBType;
}

export const PermissionControl = observer(({ id, data }: IPermissionControl) => {
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
      </Stack>
      <Group position="apart" mb={4}>
        <TakeOwnership id={id} />
        <AddAPermissionRule id={id} />
      </Group>
    </Stack>
  );
});
