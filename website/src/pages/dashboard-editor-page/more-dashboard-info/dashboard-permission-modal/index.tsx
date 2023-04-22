import { ActionIcon, Alert, Group, LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconLock, IconLockOpen } from '@tabler/icons';
import { useCreation } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { useAccountContext } from '../../../../frames/require-auth/account-context';
import { createPermissionModel } from './model';
import { PermissionControl } from './permission-control';

export const DashboardPermissionModal = observer(() => {
  const { store } = useDashboardStore();
  const { canEdit, isAdmin } = useAccountContext();
  const dashboard_id = store.currentID;
  const model = useCreation(() => createPermissionModel(dashboard_id), [dashboard_id]);

  const [opened, { open, close }] = useDisclosure(false);
  const uncontrolled = model.access.length === 0;
  const onlyAdminCanEdit = model.owner_id === null || uncontrolled;
  const iCanEdit = onlyAdminCanEdit ? isAdmin : canEdit;
  if (!iCanEdit) {
    return null;
  }

  const postSubmit = () => {
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        zIndex={320}
        size="600px"
        closeOnClickOutside={false}
        title={<Group>Permission</Group>}
        overflow="inside"
      >
        <LoadingOverlay visible={model.loading} />
        {model.loaded && <PermissionControl model={model} postSubmit={postSubmit} />}
        {!model.loading && !model.loaded && (
          <Alert icon={<IconAlertCircle size={16} />} title="Failed to load permission info" color="red">
            {model.error}
          </Alert>
        )}
      </Modal>
      <ActionIcon onClick={open} color={uncontrolled ? 'orange' : 'green'} variant="light">
        {uncontrolled ? <IconLockOpen size={16} /> : <IconLock size={16} />}
      </ActionIcon>
    </>
  );
});
