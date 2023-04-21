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
  const { canEdit, account } = useAccountContext();

  const id = store.currentID;

  const [opened, { open, close }] = useDisclosure(false);
  const { data, loading } = useRequest(
    async () => {
      const resp = await DashboardPermissionAPI.list({
        filter: { id: { value: id, isFuzzy: false } },
        pagination: { page: 1, pagesize: 100000 },
      });
      return resp.data?.[0];
    },
    {
      refreshDeps: [id, opened],
    },
  );
  const uncontrolled = data?.access.length === 0;
  const onlyAdminCanEdit = data?.owner_id === null || uncontrolled;
  const iCanEdit = onlyAdminCanEdit ? account.role_id >= 40 : canEdit;
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
        {data && <PermissionControl data={data} uncontrolled={uncontrolled} />}
      </Modal>
      <ActionIcon onClick={open} color={uncontrolled ? 'orange' : 'green'} variant="light">
        {uncontrolled ? <IconLockOpen size={16} /> : <IconLock size={16} />}
      </ActionIcon>
    </>
  );
});
