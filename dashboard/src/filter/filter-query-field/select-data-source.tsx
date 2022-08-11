import { Group, Select, Stack, Tabs, Textarea } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { listDataSources } from '../../api-caller';
import { IFilterOptionQuery } from '../../model/filters/filter/common';

interface ISelectDataSource {
  value: IFilterOptionQuery;
  onChange: (v: IFilterOptionQuery) => void;
}
export const SelectDataSource = observer(function _SelectDataSource({ value, onChange }: ISelectDataSource) {
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
    const sources = querySources.filter(({ type }) => type === value.type);
    if (!sources) {
      return [];
    }
    return sources.map(({ key }) => ({
      label: key,
      value: key,
    }));
  }, [querySources, value.type]);

  return (
    <Group grow>
      <Select
        label="Data Source Type"
        data={querySourceTypeOptions}
        sx={{ flex: 1 }}
        disabled={loading}
        value={value.type}
        onChange={(type: any) => {
          onChange({ ...value, type });
        }}
      />
      <Select
        label="Data Source Key"
        data={querySourceKeyOptions}
        sx={{ flex: 1 }}
        disabled={loading}
        value={value.key}
        onChange={(key: string) => {
          onChange({ ...value, key });
        }}
      />
    </Group>
  );
});
