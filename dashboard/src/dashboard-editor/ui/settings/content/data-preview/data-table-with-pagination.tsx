import { Box, LoadingOverlay } from '@mantine/core';
import { useMemo, useState } from 'react';
import { ErrorBoundary, errorBoundary } from '~/utils';
import { DataTable } from './data-table';
import { PaginationControl } from './pagination-control';

export const DataTableWithPagination = errorBoundary(({ data, loading }: { data: TQueryData; loading: boolean }) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const tableData = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return data.slice(start, end);
  }, [data, page, limit]);
  return (
    <ErrorBoundary>
      <PaginationControl data={data} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
      <Box py={10} sx={{ width: '100%', height: 'calc(100% - 42px)', overflow: 'auto', position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <DataTable data={tableData} />
      </Box>
    </ErrorBoundary>
  );
});
