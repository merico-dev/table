import { ActionIcon, Box, Group, Stack, Tabs, Text, Textarea, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { QueryModelInstance } from '../../model/queries';
import { MinimalMonacoEditor } from '../minimal-monaco-editor';
import { SelectDataSource } from '../select-data-source';
import { QueryConfigurations } from './configurations';

import { DeleteQuery } from './delete-query';
import { PreviewSQL } from './preview-sql';

interface IQueryForm {
  queryModel: QueryModelInstance;
}

export const QueryForm = observer(function _QueryForm({ queryModel }: IQueryForm) {
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
      <Tabs defaultValue="SQL">
        <Tabs.List grow>
          <Tabs.Tab value="Configurations">Configurations</Tabs.Tab>
          <Tabs.Tab value="SQL">
            <Group spacing={14}>
              SQL
              <ActionIcon mr={5} variant="filled" color="blue" disabled={!sqlChanged} onClick={submitSQLChanges}>
                <DeviceFloppy size={20} />
              </ActionIcon>
            </Group>
          </Tabs.Tab>
          <Tabs.Tab value="Preview">Preview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="Configurations" pt="sm">
          <QueryConfigurations queryModel={queryModel} />
        </Tabs.Panel>
        <Tabs.Panel value="SQL" pt="sm">
          <Box sx={{ position: 'relative' }}>
            <MinimalMonacoEditor height="600px" value={sql} onChange={setSQL} />
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value="Preview" pt="sm">
          <PreviewSQL value={queryModel.sql} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
