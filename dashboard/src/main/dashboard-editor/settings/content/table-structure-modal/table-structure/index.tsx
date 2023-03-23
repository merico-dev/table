import { Box, Flex, Tabs, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { ColumnsTable } from './columns-table';
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
      <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative', borderLeft: '1px solid #efefef' }}>
        <Tabs
          defaultValue="columns"
          styles={{
            root: { width: '100%', height: '100%' },
            panel: { width: '100%', height: 'calc(100% - 36px)', overflow: 'auto' },
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="columns">Columns</Tabs.Tab>
            <Tabs.Tab value="indexes" disabled>
              <Tooltip label="Coming soon" withinPortal zIndex={330}>
                <Box>Indexes</Box>
              </Tooltip>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="columns">
            <ColumnsTable dataSource={dataSource} />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Flex>
  );
});
