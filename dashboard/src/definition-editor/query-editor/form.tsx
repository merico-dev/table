import { ActionIcon, Box, Group, Select, Stack, Tabs, Text, Textarea, TextInput } from '@mantine/core';
import { useRequest } from 'ahooks';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { listDataSources } from '../../api-caller';
import { QueryModelInstance } from '../../model/queries';
import { PreviewSQL } from './preview-sql';

interface IQueryForm {
  queryModel: QueryModelInstance;
}
export const QueryForm = observer(function _QueryForm({ queryModel }: IQueryForm) {
  const { data: querySources = [], loading } = useRequest(
    listDataSources,
    {
      refreshDeps: [],
    },
    [],
  );

  const querySourceTypeOptions = React.useMemo(() => {
    const types = Array.from(new Set(querySources.map(({ type }) => type)));
    return types.map((type) => ({
      label: type,
      value: type,
    }));
  }, [querySources]);

  const querySourceKeyOptions = React.useMemo(() => {
    const sources = querySources.filter(({ type }) => type === queryModel.type);
    if (!sources) {
      return [];
    }
    return sources.map(({ key }) => ({
      label: key,
      value: key,
    }));
  }, [querySources, queryModel.type]);

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
      <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Text weight={500}>Edit Query</Text>
      </Group>
      <Stack my={0} p="md" pr={40}>
        <Group grow>
          <TextInput
            placeholder="An ID unique in this dashboard"
            label="ID"
            required
            sx={{ flex: 1 }}
            disabled={loading}
            value={queryModel.id}
            onChange={(e) => {
              queryModel.setID(e.currentTarget.value);
            }}
          />
          <Select
            label="Data Source Type"
            data={querySourceTypeOptions}
            sx={{ flex: 1 }}
            disabled={loading}
            value={queryModel.type}
            onChange={queryModel.setType}
          />
          <Select
            label="Data Source Key"
            data={querySourceKeyOptions}
            sx={{ flex: 1 }}
            disabled={loading}
            value={queryModel.key}
            onChange={queryModel.setKey}
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
