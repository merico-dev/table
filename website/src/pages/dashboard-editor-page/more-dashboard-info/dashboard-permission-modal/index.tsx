import { ActionIcon, LoadingOverlay, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLock, IconLockOpen } from '@tabler/icons';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionAPI } from '../../../../api-caller/dashboard-permission';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { useAccountContext } from '../../../../frames/require-auth/account-context';

const emptyList = DashboardPermissionAPI.emptyList;

export const DashboardPermissionModal = observer(() => {
  const { store } = useDashboardStore();
  const { canEdit, account } = useAccountContext();

  const id = store.currentID;

  const [opened, { open, close }] = useDisclosure(false);
  const { data: resp = emptyList, loading } = useRequest(
    async () => {
      if (!opened) {
        return emptyList;
      }
      return DashboardPermissionAPI.list({
        filter: { id: { value: id, isFuzzy: false } },
        pagination: { page: 1, pagesize: 100000 },
      });
    },
    {
      refreshDeps: [id, opened],
    },
  );
  const uncontrolled = resp.data.every((d) => d.owner_id === null);
  const onlyAdminCanEdit = resp.total === 0 || uncontrolled;
  const iCanEdit = onlyAdminCanEdit ? account.role_id >= 40 : canEdit;
  if (!iCanEdit) {
    return null;
  }

  return (
    <>
      <Modal opened={opened} onClose={close} zIndex={320} title={'Permissions'} overflow="inside">
        <LoadingOverlay visible={loading} />
        <Text>TODO</Text>
      </Modal>
      <ActionIcon onClick={open} color={uncontrolled ? 'orange' : 'green'} variant="light">
        {uncontrolled ? <IconLockOpen size={16} /> : <IconLock size={16} />}
      </ActionIcon>
    </>
  );
});
