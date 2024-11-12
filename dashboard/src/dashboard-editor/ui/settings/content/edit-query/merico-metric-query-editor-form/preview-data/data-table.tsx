import { ActionIcon, Box, Table } from '@mantine/core';
import { IconArrowBarToRight } from '@tabler/icons-react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { AnyObject } from '~/types';
import { ErrorBoundary } from '~/utils';
import { TableStyle } from './data-table.style';

export function DataTable({ data }: { data: AnyObject[] }) {
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
    <ErrorBoundary>
      <Table sx={TableStyle} stickyHeader stickyHeaderOffset={0}>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  <ActionIcon
                    variant="subtle"
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                  >
                    <IconArrowBarToRight />
                  </ActionIcon>
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  <ErrorBoundary>
                    {typeof cell.getValue() === 'object' ? (
                      <pre>{JSON.stringify(cell.getValue(), null, 2)}</pre>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </ErrorBoundary>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ErrorBoundary>
  );
}
