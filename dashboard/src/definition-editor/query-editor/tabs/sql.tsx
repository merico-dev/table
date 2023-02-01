import { ActionIcon, Group, Tabs } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { MinimalMonacoEditor } from '~/definition-editor/minimal-monaco-editor';
import { QueryModelInstance } from '~/model';
import { PreviewSQL } from '../preview-sql';

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

  // UI stuff
  const { width } = useViewportSize();
  const subTabsOrientation = width >= 1440 ? 'horizontal' : 'vertical';

  if (!queryModel.typedAsSQL) {
    return null;
  }
  return (
    <Tabs defaultValue="Edit" orientation={subTabsOrientation}>
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
      </Tabs.List>
      <Tabs.Panel value="Edit" sx={{ position: 'relative' }} p="sm">
        <MinimalMonacoEditor height="600px" value={sql} onChange={setSQL} />
      </Tabs.Panel>
      <Tabs.Panel value="Preview" p="sm">
        <PreviewSQL value={queryModel.sql} />
      </Tabs.Panel>
    </Tabs>
  );
});
