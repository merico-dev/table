import { Box, Flex, LoadingOverlay, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';

export const TableStructure = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  useEffect(() => {
    dataSource.loadTablesIfEmpty();
  }, [dataSource]);

  console.log(dataSource.tables);

  return (
    <Flex sx={{ height: '100%' }}>
      <Box w={300} sx={{ flexGrow: 0, flexShrink: 0, position: 'relative' }}>
        <LoadingOverlay visible={dataSource.loading} />
        <Stack>Tables</Stack>
      </Box>
      <Box sx={{ flexGrow: 1 }}>Columns</Box>
    </Flex>
  );
});
