import { ActionIcon, LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLock, IconLockOpen } from '@tabler/icons';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionAPI } from '../../../../api-caller/dashboard-permission';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { useAccountContext } from '../../../../frames/require-auth/account-context';
import { PermissionControl } from './permission-control';

export const DashboardPermissionModal = observer(() => {
  const { store } = useDashboardStore();
  const { canEdit, isAdmin } = useAccountContext();

  const id = store.currentID;

  const [opened, { open, close }] = useDisclosure(false);
  const { data, loading, refresh } = useRequest(async () => DashboardPermissionAPI.get(id), {
    refreshDeps: [id, opened],
  });
  const uncontrolled = data?.access.length === 0;
  const onlyAdminCanEdit = data?.owner_id === null || uncontrolled;
  const iCanEdit = onlyAdminCanEdit ? isAdmin : canEdit;
  if (!iCanEdit) {
    return null;
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        zIndex={320}
        closeOnClickOutside={false}
        title={'Permissions'}
        overflow="inside"
      >
        <LoadingOverlay visible={loading} />
        {data && <PermissionControl id={id} data={data} refresh={refresh} />}
      </Modal>
      <ActionIcon onClick={open} color={uncontrolled ? 'orange' : 'green'} variant="light">
        {uncontrolled ? <IconLockOpen size={16} /> : <IconLock size={16} />}
      </ActionIcon>
    </>
  );
});
