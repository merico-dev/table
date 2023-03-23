import { Box, Flex, LoadingOverlay, NavLink } from '@mantine/core';
import { IconDatabase } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';

export const TableStructure = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  useEffect(() => {
    dataSource.loadTablesIfEmpty();
  }, [dataSource]);

  const { tables, columns } = dataSource;
  return (
    <Flex sx={{ height: '100%' }}>
      <Box w={300} sx={{ flexGrow: 0, flexShrink: 0, position: 'relative' }}>
        <LoadingOverlay visible={tables.loading} />
        <Box h="100%" sx={{ overflow: 'auto' }}>
          {Object.entries(tables.data).map(([table_schema, table_infos]) => (
            <NavLink
              key={table_schema}
              label={table_schema}
              icon={<IconDatabase size={14} />}
              opened={columns.table_schema === table_schema}
            >
              {table_infos.map((info) => (
                <NavLink
                  key={info.table_name}
                  label={info.table_name}
                  onClick={() => columns.setKeywords(table_schema, info.table_name)}
                  active={columns.table_name === info.table_name}
                />
              ))}
            </NavLink>
          ))}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <LoadingOverlay visible={columns.loading} />
        <Box h="100%" sx={{ overflow: 'auto' }}>
          TODO
        </Box>
      </Box>
    </Flex>
  );
});
