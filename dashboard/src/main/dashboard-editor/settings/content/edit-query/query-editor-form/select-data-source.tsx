import { Box, Group, Select, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { forwardRef, useMemo } from 'react';
import { useModelContext } from '~/contexts';
import { DataSourceType } from '~/model/queries/types';
import { listDataSources } from '../../../../../../api-caller';
import { TableStructureModal } from '../../table-structure-modal';

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
export const SelectDataSource = observer(({ value, onChange }: ISelectDataSource) => {
  const model = useModelContext();
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

  const dataSource = useMemo(() => {
    return model.datasources.find(value);
  }, [model, value]);
  return (
    <Select
      label={
        <Group position="apart">
          <Box>Data Source</Box>
          {dataSource && (
            <TableStructureModal dataSource={dataSource} triggerButtonProps={{ compact: true, size: 'xs' }} />
          )}
        </Group>
      }
      data={dataSourceOptions}
      itemComponent={DataSourceLabel}
      sx={{ flex: 1 }}
      styles={{ label: { display: 'block' } }}
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
