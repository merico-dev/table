import { Box, Flex, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { ColumnsTable } from './columns-table';
import { IndexesTable } from './indexes-table';
import { TableNavLinks } from './table-nav-links';

export const TableStructure = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  useEffect(() => {
    dataSource.loadTablesIfEmpty();
  }, [dataSource]);

  return (
    <Flex sx={{ height: '100%' }}>
      <Box w={300} sx={{ flexGrow: 0, flexShrink: 0, position: 'relative' }}>
        <TableNavLinks dataSource={dataSource} />
      </Box>
      <Stack spacing={40} sx={{ flexGrow: 1, overflow: 'auto', position: 'relative', borderLeft: '1px solid #efefef' }}>
        <ColumnsTable dataSource={dataSource} />
        <IndexesTable dataSource={dataSource} />
      </Stack>
    </Flex>
  );
});
