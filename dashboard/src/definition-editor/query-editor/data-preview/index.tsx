import { ActionIcon, Box, Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Refresh } from 'tabler-icons-react';
import { useModelContext } from '../../../contexts';
import { QueryStateMessage } from '../query-state-message';
import { DataTable } from './data-table';

export const DataPreview = observer(function _DataPreview({ id }: { id: string }) {
  const model = useModelContext();
  const { data, state } = model.getDataStuffByID(id);
  const loading = state === 'loading';
  const refresh = () => {
    model.queries.refetchDataByQueryID(id);
  };
  const firstTenRows = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.slice(0, 10);
  }, [data]);

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
        <ActionIcon mr={15} variant="subtle" color="blue" disabled={loading} onClick={refresh}>
          <Refresh size={15} />
        </ActionIcon>
      </Group>
      <Box sx={{ position: 'relative', overflow: 'auto' }}>
        <LoadingOverlay visible={loading} />
        <QueryStateMessage queryID={id} />
        <DataTable data={firstTenRows} />
      </Box>
    </Stack>
  );
});
