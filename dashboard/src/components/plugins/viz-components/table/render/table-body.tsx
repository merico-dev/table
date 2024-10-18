import { Table } from '@mantine/core';
import { Row, flexRender } from '@tanstack/react-table';
import { useCallback } from 'react';
import { useVirtual } from 'react-virtual';
import { AnyObject } from '~/types';

type Props = {
  tableContainerRef: React.RefObject<HTMLDivElement>;
  rows: Row<AnyObject>[];
};

export function TableBody({ tableContainerRef, rows }: Props) {
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    estimateSize: useCallback(() => 28, []),
    overscan: 20,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  return (
    <Table.Tbody>
      {paddingTop > 0 && (
        <Table.Tr>
          <Table.Td style={{ height: `${paddingTop}px` }} />
        </Table.Tr>
      )}
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<AnyObject>;
        return (
          <Table.Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
            ))}
          </Table.Tr>
        );
      })}
      {paddingBottom > 0 && (
        <Table.Tr>
          <Table.Td style={{ height: `${paddingBottom}px` }} />
        </Table.Tr>
      )}
    </Table.Tbody>
  );
}
