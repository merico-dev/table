import { ActionIcon, Box, Table } from '@mantine/core';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ArrowBarToRight } from 'tabler-icons-react';
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
      <Table sx={TableStyle}>
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
                <td key={cell.id}>
                  <ErrorBoundary>
                    {typeof cell.getValue() === 'object' ? (
                      <pre>{JSON.stringify(cell.getValue(), null, 2)}</pre>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </ErrorBoundary>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </ErrorBoundary>
  );
}
