import { Row, flexRender } from '@tanstack/react-table';
import { useWhyDidYouUpdate } from 'ahooks';
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

  useWhyDidYouUpdate('TableBody', {
    tableContainerRef,
    rows,
  });
  return (
    <tbody>
      {paddingTop > 0 && (
        <tr>
          <td style={{ height: `${paddingTop}px` }} />
        </tr>
      )}
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<AnyObject>;
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        );
      })}
      {paddingBottom > 0 && (
        <tr>
          <td style={{ height: `${paddingBottom}px` }} />
        </tr>
      )}
    </tbody>
  );
}
