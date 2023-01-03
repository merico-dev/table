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
    <Stack sx={{ border: '1px solid #eee', flexGrow: 1 }}>
      <Group position="apart" py="md" px="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Text weight={500}>Edit Query</Text>
        <DeleteQuery queryModel={queryModel} />
      </Group>
      <Stack my={0} p="md" pr={40}>
        <Group grow>
          <TextInput
            placeholder="A unique name"
            label="Name"
            required
            sx={{ flex: 1 }}
            value={queryModel.name}
            onChange={(e) => {
              queryModel.setName(e.currentTarget.value);
            }}
          />
          <SelectDataSource
            value={{
              type: queryModel.type,
              key: queryModel.key,
            }}
            onChange={({ type, key }) => {
              queryModel.setKey(key);
              queryModel.setType(type);
            }}
          />
        </Group>
        <Tabs defaultValue="SQL">
          <Tabs.List>
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
    </Stack>
  );
});
