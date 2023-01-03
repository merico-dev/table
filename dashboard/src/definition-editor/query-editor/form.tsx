import { ActionIcon, Box, Group, Stack, Tabs } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { QueryModelInstance } from '../../model/queries';
import { MinimalMonacoEditor } from '../minimal-monaco-editor';
import { QueryConfigurations } from './configurations';

import { PreviewSQL } from './preview-sql';

interface IQueryForm {
  queryModel: QueryModelInstance;
}

export const QueryForm = observer(function _QueryForm({ queryModel }: IQueryForm) {
  const { width } = useViewportSize();
  const tabsOrientation = width >= 1440 ? 'vertical' : 'horizontal';

  const [sql, setSQL] = React.useState(queryModel.sql);

  React.useEffect(() => {
    setSQL((sql) => {
      if (sql !== queryModel.sql) {
        return queryModel.sql;
      }
      return sql;
    });
  }, [queryModel.sql]);

  const sqlChanged = sql !== queryModel.sql;

  const submitSQLChanges = () => {
    queryModel.setSQL(sql);
  };

  return (
    <Stack sx={{ flexGrow: 1 }} my={0} p={0}>
      <Tabs defaultValue="SQL" orientation={tabsOrientation} styles={{ tabLabel: { width: '100%' } }}>
        <Tabs.List grow={tabsOrientation === 'horizontal'}>
          <Tabs.Tab value="Configurations">Configurations</Tabs.Tab>
          <Tabs.Tab value="SQL">
            <Group spacing={14} position="apart">
              SQL
              <ActionIcon mr={5} variant="filled" color="blue" disabled={!sqlChanged} onClick={submitSQLChanges}>
                <DeviceFloppy size={20} />
              </ActionIcon>
            </Group>
          </Tabs.Tab>
          <Tabs.Tab value="Preview">Preview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="Configurations" p="sm">
          <QueryConfigurations queryModel={queryModel} />
        </Tabs.Panel>
        <Tabs.Panel value="SQL" p="sm">
          <Box sx={{ position: 'relative' }}>
            <MinimalMonacoEditor height="600px" value={sql} onChange={setSQL} />
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value="Preview" p="sm">
          <PreviewSQL value={queryModel.sql} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
