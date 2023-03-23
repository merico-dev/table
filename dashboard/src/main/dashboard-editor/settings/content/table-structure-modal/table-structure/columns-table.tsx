import { ActionIcon, Badge, Box, Table, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { ColumnInfoType } from '~/model/datasources/columns';

import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { LoadingSkeleton } from './loading-skeleton';

const TooltipValue = ({ value }: { value: string }) => {
  if (value === null || value === '') {
    return null;
  }
  return (
    <Tooltip label={value} disabled={!value}>
      <ActionIcon>
        <IconInfoCircle size={14} />
      </ActionIcon>
    </Tooltip>
  );
};

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
    <Box w="100%" h="100%" sx={{ overflow: 'auto' }}>
      <Table highlightOnHover fontSize={14} sx={{ tableLayout: 'fixed', tbody: { fontFamily: 'monospace' } }}>
        <colgroup>
          <col style={{ width: 50, maxWidth: 50 }} />
          <col style={{ width: 250 }} />
          <col style={{ width: 30 }} />
          <col style={{ width: 70 }} />
          <col style={{ width: 250 }} />
          <col style={{ width: 80 }} />
          <col style={{ width: 120 }} />
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
    </Box>
  );
});
