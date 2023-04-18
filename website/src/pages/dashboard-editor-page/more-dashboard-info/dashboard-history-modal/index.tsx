import { ActionIcon, Group, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHistory } from '@tabler/icons';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DashboardChangelogAPI } from '../../../../api-caller/dashboard-changelog';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { ChangelogContent } from './changelog-content';

const modalStyles = {
  modal: { paddingLeft: '0px !important', paddingRight: '0px !important' },
  header: { width: '100vw', marginBottom: 0, padding: '0 20px 10px', borderBottom: '1px solid #efefef' },
  title: { flexGrow: 1 },
  body: {
    height: 'calc(100% - 42px)',
  },
};

export const DashboardHistoryModal = observer(() => {
  const { store } = useDashboardStore();
  const id = store.currentID;

  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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
  const maxPage = Math.ceil((resp?.total ?? 0) / pageSize);
  const props = {
    loading,
    total: resp?.total ?? 0,
    maxPage,
    page,
    setPage,
    pageSize,
    setPageSize,
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        zIndex={320}
        title={
          <Group position="apart" sx={{ flexGrow: 1 }}>
            <Text fw={500}>Changelogs</Text>
          </Group>
        }
        fullScreen
        styles={modalStyles}
      >
        {resp && <ChangelogContent resp={resp} {...props} />}
      </Modal>
      <ActionIcon onClick={open} color="blue" variant="light">
        <IconHistory size={16} />
      </ActionIcon>
    </>
  );
});
