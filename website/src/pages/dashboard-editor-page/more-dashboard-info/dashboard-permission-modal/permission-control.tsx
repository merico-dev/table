import { Divider, Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';
import { AddAPermissionRule } from './add-a-permission-rule';
import { DashboardOwnerInfo } from './dashboard-owner-info';
import { TakeOwnership } from './take-ownership';
import { PermissionTable } from './permission-table';

interface IPermissionControl {
  id: string;
  refresh: () => void;
  data: DashboardPermissionDBType;
}

export const PermissionControl = observer(({ id, refresh, data }: IPermissionControl) => {
  return (
    <Stack spacing={20}>
      <Group position="apart" mb={4}>
        <TakeOwnership id={id} refresh={refresh} />
        <AddAPermissionRule id={id} />
      </Group>
      <PermissionTable data={data.access} />
      <Divider variant="dashed" />
      <DashboardOwnerInfo data={data} />
    </Stack>
  );
});
