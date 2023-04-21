import { Divider, Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';
import { AddAPermissionRule } from './add-a-permission-rule';
import { DashboardOwnerInfo } from './dashboard-owner-info';
import { TakeOwnership } from './take-ownership';
import { PermissionTable } from './permission-table';
import { SubmitPermissionChanges } from './submit-permission-changes';

interface IPermissionControl {
  id: string;
  refresh: () => void;
  postSubmit: () => void;
  data: DashboardPermissionDBType;
}

export const PermissionControl = observer(({ id, refresh, data, postSubmit }: IPermissionControl) => {
  return (
    <Stack spacing={20}>
      <DashboardOwnerInfo data={data} />
      <PermissionTable data={data.access} />
      <Divider variant="dashed" />
      <Group position="apart">
        <TakeOwnership id={id} refresh={refresh} />
        <Group position="right" mb={4}>
          <AddAPermissionRule id={id} />
          <SubmitPermissionChanges id={id} postSubmit={postSubmit} />
        </Group>
      </Group>
    </Stack>
  );
});
