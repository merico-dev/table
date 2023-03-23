import { Box, Flex, LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { ColumnsTable } from './columns-table';
import { TableNavLinks } from './table-nav-links';

export const TableStructure = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  useEffect(() => {
    dataSource.loadTablesIfEmpty();
  }, [dataSource]);

  const { tables, columns } = dataSource;
  return (
    <Flex sx={{ height: '100%' }}>
      <Box w={300} sx={{ flexGrow: 0, flexShrink: 0, position: 'relative' }}>
        <LoadingOverlay visible={tables.loading} />
        <TableNavLinks dataSource={dataSource} />
      </Box>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <LoadingOverlay visible={columns.loading} />
        <ColumnsTable dataSource={dataSource} />
      </Box>
    </Flex>
  );
});
