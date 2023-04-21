import { ActionIcon, AppShell, LoadingOverlay, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHistory, IconLockOpen } from '@tabler/icons';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DashboardChangelogAPI } from '../../../../api-caller/dashboard-changelog';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';

export const DashboardPermissionModal = observer(() => {
  const { store } = useDashboardStore();
  const id = store.currentID;

  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const { data: resp, loading } = useRequest(
    async () => {
      if (!opened) {
        return DashboardChangelogAPI.emptyList;
      }
      return DashboardChangelogAPI.list({
        filter: { dashboard_id: { value: id, isFuzzy: false } },
        pagination: { page, pagesize: pageSize },
      });
    },
    {
      refreshDeps: [id, page, pageSize, opened],
    },
  );
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        closeOnClickOutside={false}
        zIndex={320}
        title={null}
        overflow="inside"
      >
        <LoadingOverlay visible={loading} />
        <Text>TODO</Text>
      </Modal>
      <ActionIcon onClick={open} color="blue" variant="light">
        {/* TODO: icons by permission state */}
        <IconLockOpen size={16} />
      </ActionIcon>
    </>
  );
});
