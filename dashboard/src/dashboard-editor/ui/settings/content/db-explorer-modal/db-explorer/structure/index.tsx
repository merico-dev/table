import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { ErrorBoundary } from '~/utils';
import { ColumnsTable } from './columns-table';
import { IndexesTable } from './indexes-table';

export const Structure = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  return (
    <Stack gap={40} pt={10} sx={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
      <ErrorBoundary>
        <ColumnsTable dataSource={dataSource} />
      </ErrorBoundary>
      <ErrorBoundary>
        <IndexesTable dataSource={dataSource} />
      </ErrorBoundary>
    </Stack>
  );
});
