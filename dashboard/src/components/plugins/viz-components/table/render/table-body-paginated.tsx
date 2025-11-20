import { Table } from '@mantine/core';
import { Row, flexRender } from '@tanstack/react-table';
import { AnyObject } from '~/types';

type Props = {
  rows: Row<AnyObject>[];
};

export function TableBodyPaginated({ rows }: Props) {
  return (
    <Table.Tbody>
      {rows.map((row) => (
        <Table.Tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
          ))}
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
}
