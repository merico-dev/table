import { ActionIcon, Alert, Group, LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconLock, IconLockOpen } from '@tabler/icons-react';
import { useCreation } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { useAccountContext } from '../../../../frames/require-auth/account-context';
import { createPermissionModel } from './model';
import { PermissionControl } from './permission-control';
import { useEffect } from 'react';

export const DashboardPermissionModal = observer(() => {
  const { store } = useDashboardStore();
  const { canEdit, isAdmin, account } = useAccountContext();
  const dashboard_id = store.currentID;
  const [opened, { open, close }] = useDisclosure(false);

  const model = useCreation(() => createPermissionModel(dashboard_id, account.id), [dashboard_id, account.id]);

  useEffect(() => {
    model.load();
  }, [opened, model]);

  if (!model.isOwner && !isAdmin) {
    return null;
  }
  if (model.isOwner && !canEdit) {
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
      >
        <LoadingOverlay visible={model.loading} />
        {model.loaded && <PermissionControl model={model} postSubmit={postSubmit} />}
        {!model.loading && !model.loaded && (
          <Alert icon={<IconAlertCircle size={16} />} title="Failed to load permission info" color="red">
            {model.error}
          </Alert>
        )}
      </Modal>
      <ActionIcon onClick={open} color={model.controlled ? 'green' : 'orange'} variant="light">
        {model.controlled ? <IconLock size={16} /> : <IconLockOpen size={16} />}
      </ActionIcon>
    </>
  );
});
