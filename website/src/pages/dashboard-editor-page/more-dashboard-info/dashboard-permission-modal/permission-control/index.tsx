import { Divider, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PermissionModelInstance } from '../model';
import { AddAnAccessRule } from './add-an-access-rule';
import { DashboardOwnerInfo } from './dashboard-owner-info';
import { AccessRulesTable } from './access-rules-table';
import { SubmitPermissionChanges } from './submit-permission-changes';
import { TakeOwnership } from './take-ownership';
import { useAccountContext } from '../../../../../frames/require-auth/account-context';

interface IPermissionControl {
  model: PermissionModelInstance;
  postSubmit: () => void;
}

export const PermissionControl = observer(({ model, postSubmit }: IPermissionControl) => {
  const { isAdmin } = useAccountContext();
  return (
    <Stack spacing={10}>
      <DashboardOwnerInfo model={model} />
      <AccessRulesTable model={model} />
      <Divider mt={-10} mb={10} variant="dashed" />
      <Group position="apart">
        <Group position="left" mb={4}>
          {isAdmin && !model.isOwner && <TakeOwnership model={model} />}
          {model.isOwner && <AddAnAccessRule model={model} />}
        </Group>
        <Group position="right" mb={4}>
          {model.isOwner && <SubmitPermissionChanges model={model} postSubmit={postSubmit} />}
        </Group>
      </Group>
    </Stack>
  );
});
