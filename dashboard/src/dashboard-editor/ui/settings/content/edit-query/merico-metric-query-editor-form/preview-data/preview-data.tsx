import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

import { IconDownload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { downloadDataAsCSV } from '~/utils/download';
import { DataTableWithPagination } from './data-table-with-pagination';
import { QueryStateMessage } from './query-state-message';

type Props = {
  queryModel: QueryModelInstance;
};
export const PreviewData = observer(({ queryModel }: Props) => {
  const { t } = useTranslation();
  const { data, state } = queryModel;
  const loading = state === 'loading';
  const refresh = useCallback(() => {
    queryModel.fetchData(true);
  }, [queryModel.fetchData]);

  const download = () => {
    downloadDataAsCSV(queryModel.name, queryModel.data);
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  const dataEmpty = !Array.isArray(data) || data.length === 0;
  return (
    <Stack
      gap={0}
      sx={{ minHeight: '250px', maxHeight: 'calc(50vh - 48px)', flexGrow: 1, flexShrink: 0, background: '#F9F9FA' }}
    >
      <Group justify="space-between" py={7} px={8}>
        <Text size="sm" fw={500}>
          查询结果
        </Text>
        <Button
          size="xs"
          variant="transparent"
          color="gray"
          leftSection={<IconDownload size={16} />}
          disabled={loading || dataEmpty}
          onClick={download}
        >
          下载查询结果
        </Button>
      </Group>
      <Box sx={{ position: 'relative', flexGrow: 1, overflow: 'hidden' }}>
        <QueryStateMessage queryModel={queryModel} />
        <DataTableWithPagination data={data} loading={loading} />
      </Box>
    </Stack>
  );
});
