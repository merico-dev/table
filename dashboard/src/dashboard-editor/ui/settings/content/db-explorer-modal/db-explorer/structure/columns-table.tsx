import { Badge, Table, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ColumnInfoType } from '~/dashboard-editor/model/datasources/db-info/columns';

import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { LoadingSkeleton } from './loading-skeleton';
import { TooltipValue } from './tooltip-value';

const ColumnKey = ({ column }: { column: ColumnInfoType }) => {
  const { column_key, column_key_text } = column;
  if (!column_key) {
    return null;
  }
  return (
    <Tooltip label={column_key_text} disabled={!column_key_text}>
      <Badge variant="light">{column_key}</Badge>
    </Tooltip>
  );
};

export const ColumnsTable = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { columns } = dataSource.dbInfo;

  if (columns.loading) {
    return <LoadingSkeleton height="24px" width="100%" lastWidth="100%" count={20} pl={6} />;
  }
  if (columns.empty) {
    return null;
  }

  return (
    <Table
      highlightOnHover
      fz={14}
      sx={{
        width: 'auto',
        minWidth: '1000px',
        alignSelf: 'flex-start',
        flexGrow: 0,
        tableLayout: 'fixed',
        tbody: { fontFamily: 'monospace' },
      }}
    >
      <colgroup>
        <col style={{ width: 50 }} />
        <col style={{ minWidth: 300 }} />
        <col style={{ width: 30 }} />
        <col style={{ width: 70 }} />
        <col style={{ minWidth: 300 }} />
        <col style={{ minWidth: 80, width: 80 }} />
        <col style={{ minWidth: 120, width: 120 }} />
      </colgroup>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>#</Table.Th>
          <Table.Th>Column Name</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th></Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Nullable</Table.Th>
          <Table.Th>Default Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {columns.data.map((c) => (
          <Table.Tr key={c.column_name}>
            <Table.Td>{c.ordinal_position}</Table.Td>
            <Table.Td>{c.column_name}</Table.Td>
            <Table.Td>
              <TooltipValue value={c.column_comment} />
            </Table.Td>
            <Table.Td>
              <ColumnKey column={c} />
            </Table.Td>
            <Table.Td>{c.column_type}</Table.Td>
            <Table.Td>{c.is_nullable}</Table.Td>
            <Table.Td>
              <TooltipValue value={c.column_default} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
});
