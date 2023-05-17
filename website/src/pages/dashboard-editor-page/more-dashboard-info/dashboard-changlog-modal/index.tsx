import { ActionIcon, AppShell, LoadingOverlay, Modal } from '@mantine/core';
import { IconHistory } from '@tabler/icons';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { APICaller } from '../../../../api-caller';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { ChangelogContent } from './changelog-content';
import { ChangelogNavbar } from './changelog-navbar';
import { TModalState } from '../types';

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

interface IDashboardChangelogModal {
  state: TModalState;
}

export const DashboardChangelogModal = observer(({ state }: IDashboardChangelogModal) => {
  const { store } = useDashboardStore();
  const id = store.currentID;
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const { data: resp, loading } = useRequest(
    async () => {
      if (!state.opened) {
        return APICaller.dashboard_changelog.emptyList;
      }
      return APICaller.dashboard_changelog.list({
        filter: { dashboard_id: { value: id, isFuzzy: false } },
        pagination: { page, pagesize: pageSize },
      });
    },
    {
      refreshDeps: [id, page, pageSize, state.opened],
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
    <Modal
      opened={state.opened}
      onClose={state.close}
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
            close={state.close}
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
        <LoadingOverlay visible={loading} />
        <ChangelogContent current={current} maxPage={maxPage} loading={loading} />
      </AppShell>
    </Modal>
  );
});
