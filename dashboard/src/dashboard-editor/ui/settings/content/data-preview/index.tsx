import { ActionIcon, Box, Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useCallback, useEffect } from 'react';

import { IconDownload, IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useRenderContentModelContext } from '~/contexts';
import { DataTableWithPagination } from './data-table-with-pagination';
import { QueryStateMessage } from './query-state-message';

export const DataPreview = observer(
  ({ id, moreActions, refreshOnMount }: { id: string; moreActions: ReactNode | null; refreshOnMount?: boolean }) => {
    const { t } = useTranslation();
    const content = useRenderContentModelContext();
    const { data, state } = content.getDataStuffByID(id);
    const loading = state === 'loading';
    const refresh = useCallback(() => {
      content.queries.refetchDataByQueryID(id);
    }, [id, content]);

    const download = () => {
      content.queries.downloadDataByQueryID(null, id);
    };

    useEffect(() => {
      refreshOnMount && refresh();
    }, [refresh, refreshOnMount]);

    const dataEmpty = !Array.isArray(data) || data.length === 0;
    return (
      <Stack gap={0} sx={{ height: '100%', border: '1px solid #eee' }}>
        <Group justify="space-between" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Group justify="flex-start">
            <Text size="sm" fw={500}>
              {t('data.preview_data')}
            </Text>
          </Group>
          <Group pr={15}>
            {moreActions}
            <ActionIcon variant="subtle" color="blue" disabled={loading} onClick={refresh}>
              <IconRefresh size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="blue" disabled={loading || dataEmpty} onClick={download}>
              <IconDownload size={16} />
            </ActionIcon>
          </Group>
        </Group>
        <Box pb={20} sx={{ position: 'relative', flexGrow: 1, overflow: 'auto' }}>
          <QueryStateMessage queryID={id} />
          <DataTableWithPagination data={data} loading={loading} />
        </Box>
      </Stack>
    );
  },
);
