import { Box, LoadingOverlay, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { ErrorBoundary } from '~/utils/error-boundary';
import { DataTable } from '../../../data-preview/data-table';
import { FullSpaceLoading } from '../full-space-loading';
import { PaginationControl } from './pagination-control';

export const TableData = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const tableData = dataSource.tableData;
  if (tableData.maxPage === 0) {
    return (
      <Text mt={20} color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
        This table is empty
      </Text>
    );
  }
  if (tableData.error) {
    return (
      <Text mt={20} color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
        {tableData.error}
      </Text>
    );
  }

  if (tableData.page === 1 && tableData.loading) {
    return <FullSpaceLoading visible />;
  }
  return (
    <ErrorBoundary>
      <PaginationControl dataSource={dataSource} />
      <Box py={10} sx={{ width: '100%', height: 'calc(100% - 42px)', overflow: 'auto', position: 'relative' }}>
        <LoadingOverlay visible={tableData.loading} overlayBlur={2} />
        <DataTable data={tableData.data} />
      </Box>
    </ErrorBoundary>
  );
});
