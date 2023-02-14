import { ActionIcon, Box, Group, LoadingOverlay, Stack, Table, Text } from '@mantine/core';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { ArrowBarToRight, Refresh } from 'tabler-icons-react';
import { AnyObject } from '~/types';
import { useModelContext } from '../../../contexts';
import { QueryStateMessage } from '../query-state-message';
import './index.css';

function DataTable({ data }: { data: AnyObject[] }) {
  const columns = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    const columnHelper = createColumnHelper<AnyObject>();
    return Object.keys(data[0]).map((k) => {
      return columnHelper.accessor(k, {
        cell: (info) => info.getValue(),
      });
    });
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
  });
  if (data.length === 0) {
    return <Box sx={{ height: '5em' }} />;
  }
  return (
    <Table sx={{ tableLayout: 'fixed' }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} style={{ width: header.getSize() }}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                <ActionIcon
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                >
                  <ArrowBarToRight />
                </ActionIcon>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

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
