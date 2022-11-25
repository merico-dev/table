import { ActionIcon, Box, Group, Stack, Tabs, Text, Textarea, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { QueryModelInstance } from '../../model/queries';
import { SelectDataSource } from '../select-data-source';

import { DeleteQuery } from './delete-query';
import { PreviewSQL } from './preview-sql';

interface IQueryForm {
  queryModel: QueryModelInstance;
  setCurrentID: React.Dispatch<React.SetStateAction<string>>;
}

export const QueryForm = observer(function _QueryForm({ queryModel, setCurrentID }: IQueryForm) {
  const initialID = React.useRef(queryModel.id);
  const [id, setID] = React.useState(initialID.current);
  React.useEffect(() => {
    if (initialID.current !== queryModel.id) {
      setID(queryModel.id);
      initialID.current = queryModel.id;
    }
  }, [initialID, queryModel.id]);

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

  const submitIDChanges = () => {
    queryModel.setID(id);
    setCurrentID(id);
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
            placeholder="An ID unique in this dashboard"
            label="ID"
            required
            sx={{ flex: 1 }}
            value={id}
            onChange={(e) => {
              setID(e.currentTarget.value);
            }}
            rightSection={
              <ActionIcon
                mr={5}
                variant="filled"
                color="blue"
                disabled={id === queryModel.id}
                onClick={submitIDChanges}
              >
                <DeviceFloppy size={18} />
              </ActionIcon>
            }
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
            <Tabs.Tab value="SQL">SQL</Tabs.Tab>
            <Tabs.Tab value="Preview">Preview</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="SQL" pt="sm">
            <Box sx={{ position: 'relative' }}>
              <Textarea
                autosize
                minRows={12}
                maxRows={24}
                className="code-textarea"
                value={sql}
                onChange={(e) => {
                  setSQL(e.currentTarget.value);
                }}
              />
              <ActionIcon
                mr={5}
                variant="filled"
                color="blue"
                sx={{ position: 'absolute', right: 10, top: 10 }}
                disabled={!sqlChanged}
                onClick={submitSQLChanges}
              >
                <DeviceFloppy size={20} />
              </ActionIcon>
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
