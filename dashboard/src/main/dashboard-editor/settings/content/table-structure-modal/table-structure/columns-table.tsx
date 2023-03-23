import { Box, Table } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DataSourceModelInstance } from '~/model/datasources/datasource';

export const ColumnsTable = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { columns } = dataSource;
  return (
    <Box h="100%" sx={{ overflow: 'auto' }}>
      <Table highlightOnHover fontSize={14} sx={{ tbody: { fontFamily: 'monospace' } }}>
        <thead>
          <tr>
            <th style={{ width: 50 }}>#</th>
            <th style={{ width: 250 }}>Column Name</th>
            <th style={{ width: 200 }}>Type</th>
            <th style={{ width: 100 }}>Nullable</th>
            <th style={{ width: 250 }}>Default</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {columns.data.map((c) => (
            <tr key={c.column_name}>
              <td>{c.ordinal_position}</td>
              <td>{c.column_name}</td>
              <td>{c.column_type}</td>
              <td>{c.is_nullable}</td>
              <td>{c.column_default}</td>
              <td>{c.column_comment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
});
