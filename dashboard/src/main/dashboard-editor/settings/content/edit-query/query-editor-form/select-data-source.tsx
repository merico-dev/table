import { Group, Select, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { forwardRef, useMemo } from 'react';
import { DataSourceType } from '~/model/queries/types';
import { listDataSources } from '../../../../../../api-caller';

const DataSourceLabel = forwardRef<HTMLDivElement, { label: string; type: DataSourceType }>(
  ({ label, type, ...others }, ref) => (
    <Group position="apart" ref={ref} {...others}>
      <Text>{label}</Text>
      <Text>{type}</Text>
    </Group>
  ),
);

interface ISelectDataSource {
  value: { type: DataSourceType; key: string };
  onChange: (v: { type: DataSourceType; key: string }) => void;
}
export const SelectDataSource = observer(function _SelectDataSource({ value, onChange }: ISelectDataSource) {
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

  return (
    <Select
      label="Data Source"
      data={dataSourceOptions}
      itemComponent={DataSourceLabel}
      sx={{ flex: 1 }}
      required
      disabled={loading}
      value={value.key}
      onChange={(key) => {
        if (key === null) {
          return;
        }
        onChange({
          key,
          type: dataSourceTypeMap[key],
        });
      }}
    />
  );
});
