import { Badge, Box, Flex, Group, LoadingOverlay, Modal, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { APICaller } from '../../../../api-caller';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { TModalState } from '../types';
import { ChangelogContent } from './changelog-content';
import { ChangelogNavbar } from './changelog-navbar';

const ModalStyles = {
  modal: { padding: '0 !important' },
  header: { marginBottom: 0, width: '100%', padding: '10px 20px 10px', borderBottom: '1px solid #efefef' },
  title: { flexGrow: 1 },
  body: {
    padding: '0',
    height: 'calc(100% - 50px)',
  },
};

interface IDashboardChangelogModal {
  state: TModalState;
}

export const DashboardChangelogModal = observer(({ state }: IDashboardChangelogModal) => {
  const { store } = useDashboardStore();
  const id = store.currentContentID;
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const { data: resp, loading } = useRequest(
    async () => {
      if (!state.opened) {
        return APICaller.dashboard_content_changelog.emptyList;
      }
      return APICaller.dashboard_content_changelog.list({
        filter: { dashboard_content_id: { value: id, isFuzzy: false } },
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

  const name = store.currentDetail?.content.fullData?.name ?? '';
  return (
    <Modal
      opened={state.opened}
      onClose={state.close}
      closeOnClickOutside={false}
      zIndex={320}
      title={
        <Group position="apart" sx={{ flexGrow: 1 }}>
          <Text fw={500}>Changelog</Text>
          <Group spacing={7}>
            {name && (
              <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                Version: {name}
              </Badge>
            )}
          </Group>
        </Group>
      }
      fullScreen
      styles={ModalStyles}
    >
      <LoadingOverlay visible={loading} />
      <Flex sx={{ width: '100%', height: '100%' }}>
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
        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <ChangelogContent current={current} maxPage={maxPage} loading={loading} />
        </Box>
      </Flex>
    </Modal>
  );
});
