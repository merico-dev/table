import { Box, Flex, Tabs, Text } from '@mantine/core';
import { IconColumns, IconDatabase } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { ErrorBoundary } from '~/utils/error-boundary';
import { Structure } from './structure';
import { TableNavLinks } from './table-nav-links';
import { TableData } from './table-data';

const tabsStyles = {
  root: {
    flexGrow: 1,
    overflow: 'auto',
    borderLeft: '1px solid #efefef',
  },
  tabsList: {
    borderBottom: '1px solid #efefef',
  },
  tab: {
    minWidth: 120,
  },
};

export const DBExplorer = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  useEffect(() => {
    dataSource.loadTablesIfEmpty();
  }, [dataSource]);

  if (dataSource.tables.error) {
    return (
      <Text color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
        {dataSource.tables.error}
      </Text>
    );
  }
  return (
    <Flex sx={{ height: '100%' }}>
      <Box w={300} sx={{ flexGrow: 0, flexShrink: 0, position: 'relative' }}>
        <ErrorBoundary>
          <TableNavLinks dataSource={dataSource} />
        </ErrorBoundary>
      </Box>
      <Tabs defaultValue="structure" styles={tabsStyles}>
        <Tabs.List>
          <Tabs.Tab value="structure" icon={<IconColumns size={14} />}>
            Structure
          </Tabs.Tab>
          <Tabs.Tab value="data" icon={<IconDatabase size={14} />}>
            Data
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="structure">
          <Structure dataSource={dataSource} />
        </Tabs.Panel>
        <Tabs.Panel value="data" sx={{ width: '100%', height: 'calc(100% - 36px)', overflow: 'hidden' }}>
          <TableData dataSource={dataSource} />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
});
