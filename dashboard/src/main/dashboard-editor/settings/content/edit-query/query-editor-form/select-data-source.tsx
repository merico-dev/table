import { Box, Group, Select, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { forwardRef, useMemo } from 'react';
import { useModelContext } from '~/contexts';
import { DataSourceType } from '~/model/queries/types';
import { listDataSources } from '../../../../../../api-caller';
import { DBExplorerModal } from '../../db-explorer-modal';

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

  const handleChange = (key: string) => {
    if (key === null) {
      return;
    }
    onChange({
      key,
      type: dataSourceTypeMap[key],
    });
  };

  const dataSource = useMemo(() => {
    return model.datasources.find(value);
  }, [model, value]);
  return (
    <Select
      data={dataSourceOptions}
      label={
        <Group position="apart">
          <Box>Data Source</Box>
          {dataSource && (
            <DBExplorerModal dataSource={dataSource} triggerButtonProps={{ compact: true, size: 'xs', px: 10 }} />
          )}
        </Group>
      }
      itemComponent={DataSourceLabel}
      rightSection={
        dataSource ? (
          <Text size="xs" color="dimmed">
            {dataSource.type}
          </Text>
        ) : undefined
      }
      rightSectionWidth={85}
      maxDropdownHeight={280}
      styles={{
        root: { flex: 1 },
        label: { display: 'block' },
        rightSection: {
          pointerEvents: 'none',
          justifyContent: 'flex-end',
          paddingRight: '10px',
          '.mantine-Text-root': { userSelect: 'none' },
        },
      }}
      disabled={loading}
      value={value.key}
      onChange={handleChange}
    />
  );
});
