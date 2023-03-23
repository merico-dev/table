import { Box, Flex, LoadingOverlay, NavLink } from '@mantine/core';
import { IconDatabase } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';

export const TableStructure = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  useEffect(() => {
    dataSource.loadTablesIfEmpty();
  }, [dataSource]);

  return (
    <Flex sx={{ height: '100%' }}>
      <Box w={300} sx={{ flexGrow: 0, flexShrink: 0, position: 'relative' }}>
        <LoadingOverlay visible={dataSource.tables.loading} />
        <Box h="100%" sx={{ overflow: 'auto' }}>
          {Object.entries(dataSource.tables.data).map(([table_schema, table_infos]) => (
            <NavLink key={table_schema} label={table_schema} icon={<IconDatabase size={14} />}>
              {table_infos.map((info) => (
                <NavLink key={info.table_name} label={info.table_name} />
              ))}
            </NavLink>
          ))}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }}>Columns</Box>
    </Flex>
  );
});
