import { ActionIcon, Box, Group, Select, Stack, Tabs, Text, Textarea, TextInput } from '@mantine/core';
import { useRequest } from 'ahooks';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataSourceType } from '~/model/queries/types';
import { listDataSources } from '../../api-caller';
import { QueryModelInstance } from '../../model/queries';
import { PreviewSQL } from './preview-sql';

const DataSourceLabel = forwardRef<HTMLDivElement, { label: string; type: DataSourceType }>(
  ({ label, type, ...others }, ref) => {
    return (
      <Group position="apart" ref={ref} {...others}>
        <Text>{label}</Text>
        <Text>{type}</Text>
      </Group>
    );
  },
);

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

  const { data: dataSources = [], loading } = useRequest(
    listDataSources,
    {
      refreshDeps: [],
    },
    [],
  );

  const dataSourceOptions = useMemo(() => {
    return dataSources.map((ds) => ({
      label: ds.key,
      value: ds.key,
      type: ds.type,
    }));
  }, [dataSources]);

  const dataSourceTypeMap = useMemo(() => {
    return dataSourceOptions.reduce((ret, curr) => {
      ret[curr.value] = curr.type;
      return ret;
    }, {} as Record<string, DataSourceType>);
  }, [dataSourceOptions]);

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
    setCurrentID(id);
    queryModel.setID(id);
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
          <Select
            label="Data Source"
            data={dataSourceOptions}
            itemComponent={DataSourceLabel}
            sx={{ flex: 1 }}
            disabled={loading}
            value={queryModel.key}
            onChange={(key) => {
              if (key === null) {
                return;
              }
              queryModel.setKey(key);
              queryModel.setType(dataSourceTypeMap[key]);
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
