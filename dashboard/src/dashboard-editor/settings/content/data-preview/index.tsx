import { ActionIcon, Box, Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useMemo } from 'react';
import { Download, Refresh } from 'tabler-icons-react';
import { useContentModelContext } from '../../../../contexts';
import { QueryStateMessage } from './query-state-message';
import { DataTable } from './data-table';

export const DataPreview = observer(function _DataPreview({
  id,
  moreActions = null,
}: {
  id: string;
  moreActions?: ReactNode;
}) {
  const content = useContentModelContext();
  const { data, state } = content.getDataStuffByID(id);
  const loading = state === 'loading';
  const refresh = () => {
    content.queries.refetchDataByQueryID(id);
  };
  const download = () => {
    content.queries.downloadDataByQueryID(id);
  };
  const firstTenRows = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.slice(0, 10);
  }, [data]);

  const dataEmpty = !Array.isArray(data) || data.length === 0;
  return (
    <Stack sx={{ border: '1px solid #eee' }}>
      <Group position="apart" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Group position="left">
          <Text weight={500}>Preview Data</Text>
          {data.length > 10 && (
            <Text size="sm" color="gray">
              Showing 10 rows of {data.length}
            </Text>
          )}
        </Group>
        <Group pr={15}>
          {moreActions}
          <ActionIcon variant="subtle" color="blue" disabled={loading} onClick={refresh}>
            <Refresh size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="blue" disabled={loading || dataEmpty} onClick={download}>
            <Download size={16} />
          </ActionIcon>
        </Group>
      </Group>
      <Box sx={{ position: 'relative', overflow: 'auto' }}>
        <LoadingOverlay visible={loading} />
        <QueryStateMessage queryID={id} />
        <DataTable data={firstTenRows} />
      </Box>
    </Stack>
  );
});
