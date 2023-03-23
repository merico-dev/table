import { Badge, Box, Table, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ColumnInfoType } from '~/model/datasources/columns';

import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { LoadingSkeleton } from './loading-skeleton';

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

  return (
    <Box h="100%" sx={{ overflow: 'auto' }}>
      <Table
        highlightOnHover
        fontSize={14}
        sx={{ tableLayout: 'fixed', minWidth: '1100px', tbody: { fontFamily: 'monospace' } }}
      >
        <thead>
          <tr>
            <th style={{ width: 50 }}>#</th>
            <th style={{ width: 200 }}>Column Name</th>
            <th style={{ width: 60 }}></th>
            <th style={{ width: 300 }}>Type</th>
            <th style={{ width: 100 }}>Nullable</th>
            <th style={{ width: 250 }}>Default</th>
            <th style={{ minWidth: 100 }}>Comment</th>
          </tr>
        </thead>
        <tbody>
          {columns.data.map((c) => (
            <tr key={c.column_name}>
              <td>{c.ordinal_position}</td>
              <td>{c.column_name}</td>
              <td>
                <ColumnKey column={c} />
              </td>
              <td>{c.column_type}</td>
              <td>{c.is_nullable}</td>
              <td>{c.column_default}</td>
              <td title={c.column_comment}>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.column_comment}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
});
