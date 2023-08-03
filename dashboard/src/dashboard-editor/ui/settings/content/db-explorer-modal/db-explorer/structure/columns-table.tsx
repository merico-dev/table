import { Badge, Table, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ColumnInfoType } from '~/dashboard-editor/model/datasources/columns';

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
      <Badge>{column_key}</Badge>
    </Tooltip>
  );
};

export const ColumnsTable = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { columns } = dataSource;

  if (columns.loading) {
    return <LoadingSkeleton height="24px" width="100%" lastWidth="100%" count={20} pl={6} />;
  }
  if (columns.empty) {
    return null;
  }

  return (
    <Table
      highlightOnHover
      fontSize={14}
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
      <thead>
        <tr>
          <th>#</th>
          <th>Column Name</th>
          <th></th>
          <th></th>
          <th>Type</th>
          <th>Nullable</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        {columns.data.map((c) => (
          <tr key={c.column_name}>
            <td>{c.ordinal_position}</td>
            <td>{c.column_name}</td>
            <td>
              <TooltipValue value={c.column_comment} />
            </td>
            <td>
              <ColumnKey column={c} />
            </td>
            <td>{c.column_type}</td>
            <td>{c.is_nullable}</td>
            <td>
              <TooltipValue value={c.column_default} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
});
