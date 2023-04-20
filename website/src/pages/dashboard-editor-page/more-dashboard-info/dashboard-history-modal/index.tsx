import { ActionIcon, AppShell, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHistory } from '@tabler/icons';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { DashboardChangelogAPI } from '../../../../api-caller/dashboard-changelog';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { ChangelogContent } from './changelog-content';
import { ChangelogNavbar } from './changelog-navbar';

const ModalStyles = {
  modal: {
    padding: '0 !important',
  },
};

const ChangelogsAppShellStyles = {
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  body: {
    flexGrow: 1,
    nav: {
      top: 0,
      height: '100vh',
    },
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 0,
    height: '100vh',
  },
} as const;

export const DashboardHistoryModal = observer(() => {
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
  const maxPage = Math.ceil((resp?.total ?? 0) / pageSize);
  const data = resp?.data;
  const [currentChangelogID, setCurrentChangelogID] = useState<string>('');
  const current = useMemo(() => {
    return data?.find((d) => d.id === currentChangelogID);
  }, [data, currentChangelogID]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && !currentChangelogID) {
      setCurrentChangelogID(data[0].id);
    }
  }, [data, currentChangelogID]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        closeOnClickOutside={false}
        zIndex={320}
        title={null}
        fullScreen
        styles={ModalStyles}
      >
        <AppShell
          padding={0}
          navbar={
            <ChangelogNavbar
              close={close}
              data={data}
              currentChangelogID={currentChangelogID}
              setCurrentChangelogID={setCurrentChangelogID}
              page={page}
              loading={loading}
              maxPage={maxPage}
              setPage={setPage}
            />
          }
          styles={ChangelogsAppShellStyles}
        >
          <ChangelogContent current={current} maxPage={maxPage} />
        </AppShell>
      </Modal>
      <ActionIcon onClick={open} color="blue" variant="light">
        <IconHistory size={16} />
      </ActionIcon>
    </>
  );
});
