import { ActionIcon, Group, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { MinimalMonacoEditor } from '~/definition-editor/minimal-monaco-editor';
import { GlobalVariablesModal } from '~/main/dashboard-editor/settings/content/view-global-vars/global-variables-modal';
import { QueryModelInstance } from '~/model';
import { PreviewSQL } from './preview-sql';

export const TabPanel_SQL = observer(({ queryModel }: { queryModel: QueryModelInstance }) => {
  // form stuff
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

  if (!queryModel.typedAsSQL) {
    return null;
  }
  return (
    <Tabs
      defaultValue="Edit"
      orientation="vertical"
      sx={{ flexGrow: 1 }}
      styles={{ tabLabel: { width: '100%' } }}
      keepMounted={false}
    >
      <Tabs.List>
        <Tabs.Tab value="Edit">
          <Group spacing={14} position="apart">
            Edit
            <ActionIcon mr={5} variant="filled" color="blue" disabled={!sqlChanged} onClick={submitSQLChanges}>
              <DeviceFloppy size={20} />
            </ActionIcon>
          </Group>
        </Tabs.Tab>
        <Tabs.Tab value="Preview">Preview</Tabs.Tab>
        <GlobalVariablesModal />
      </Tabs.List>
      <Tabs.Panel value="Edit" sx={{ position: 'relative' }} p="sm">
        <MinimalMonacoEditor height="100%" value={sql} onChange={setSQL} />
      </Tabs.Panel>
      <Tabs.Panel value="Preview" p={0} pl={4}>
        <PreviewSQL value={queryModel.sql} />
      </Tabs.Panel>
    </Tabs>
  );
});
