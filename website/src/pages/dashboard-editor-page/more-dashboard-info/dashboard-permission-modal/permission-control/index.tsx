import { Divider, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PermissionModelInstance } from '../model';
import { AddAnAccessRule } from './add-an-access-rule';
import { DashboardOwnerInfo } from './dashboard-owner-info';
import { AccessRulesTable } from './access-rules-table';
import { SubmitPermissionChanges } from './submit-permission-changes';
import { TakeOwnership } from './take-ownership';

interface IPermissionControl {
  model: PermissionModelInstance;
  postSubmit: () => void;
}

export const PermissionControl = observer(({ model, postSubmit }: IPermissionControl) => {
  return (
    <Stack spacing={10}>
      <DashboardOwnerInfo model={model} />
      <AccessRulesTable model={model} />
      <Divider my={10} variant="dashed" />
      <Group position="apart">
        <Group position="left" mb={4}>
          <TakeOwnership model={model} />
          <AddAnAccessRule model={model} />
        </Group>
        <Group position="right" mb={4}>
          <SubmitPermissionChanges model={model} postSubmit={postSubmit} />
        </Group>
      </Group>
    </Stack>
  );
});
