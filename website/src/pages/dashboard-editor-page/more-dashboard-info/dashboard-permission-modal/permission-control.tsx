import { Divider, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionDBType } from '../../../../api-caller/dashboard-permission.types';
import { AddAPermissionRule } from './add-a-permission-rule';
import { DashboardOwnerInfo } from './dashboard-owner-info';
import { PermissionTable } from './permission-table';
import { SubmitPermissionChanges } from './submit-permission-changes';
import { TakeOwnership } from './take-ownership';

interface IPermissionControl {
  id: string;
  refresh: () => void;
  postSubmit: () => void;
  data: DashboardPermissionDBType;
}

export const PermissionControl = observer(({ id, refresh, data, postSubmit }: IPermissionControl) => {
  return (
    <Stack spacing={10}>
      <DashboardOwnerInfo data={data} />
      <PermissionTable data={data.access} />
      <Divider my={10} variant="dashed" />
      <Group position="apart">
        <Group position="left" mb={4}>
          <TakeOwnership id={id} refresh={refresh} />
          <AddAPermissionRule id={id} />
        </Group>
        <Group position="right" mb={4}>
          <SubmitPermissionChanges id={id} postSubmit={postSubmit} />
        </Group>
      </Group>
    </Stack>
  );
});
