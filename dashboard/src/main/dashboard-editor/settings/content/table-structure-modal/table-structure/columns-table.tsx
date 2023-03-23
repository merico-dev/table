import { Badge, Box, Table } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { LoadingSkeleton } from './loading-skeleton';

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
            <th style={{ width: 250 }}>Column Name</th>
            <th style={{ width: 60 }}></th>
            <th style={{ width: 200 }}>Type</th>
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
              <td>{c.column_key && <Badge>{c.column_key}</Badge>}</td>
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
