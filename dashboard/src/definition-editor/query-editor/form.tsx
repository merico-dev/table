import { ActionIcon, Box, Group, Stack, Tabs } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { QueryModelInstance } from '../../model/queries';
import { MinimalMonacoEditor } from '../minimal-monaco-editor';
import { QueryConfigurations } from './configurations';
import { DataPreview } from './data-preview';

import { PreviewSQL } from './preview-sql';

interface IQueryForm {
  queryModel: QueryModelInstance;
}

export const QueryForm = observer(function _QueryForm({ queryModel }: IQueryForm) {
  const { width } = useViewportSize();
  const tabsOrientation = width >= 1440 ? 'vertical' : 'horizontal';
  const subTabsOrientation = width >= 1440 ? 'horizontal' : 'vertical';
  const tabsStyles = width >= 1440 ? { tabLabel: { width: '100%' } } : {};
  const tabsPadding = width >= 1440 ? 'sm' : 0;

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
      <Tabs defaultValue="SQL" orientation={tabsOrientation} styles={tabsStyles}>
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
          <Tabs.Tab value="Data">Data</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Configurations" p={tabsPadding}>
          <QueryConfigurations queryModel={queryModel} />
        </Tabs.Panel>

        <Tabs.Panel value="SQL" p={tabsPadding}>
          <Tabs defaultValue="Edit" orientation={subTabsOrientation}>
            <Tabs.List>
              <Tabs.Tab value="Edit">Edit</Tabs.Tab>
              <Tabs.Tab value="Preview">Preview</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="Edit" sx={{ position: 'relative' }} p="sm">
              <MinimalMonacoEditor height="600px" value={sql} onChange={setSQL} />
            </Tabs.Panel>
            <Tabs.Panel value="Preview" p="sm">
              <PreviewSQL value={queryModel.sql} />
            </Tabs.Panel>
          </Tabs>
        </Tabs.Panel>

        <Tabs.Panel value="Data" p={tabsPadding}>
          <DataPreview id={queryModel.id} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
