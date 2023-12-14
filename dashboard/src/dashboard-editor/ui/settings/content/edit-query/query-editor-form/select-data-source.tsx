import { Box, Group, Select, Text, ThemeIcon } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { forwardRef, useMemo } from 'react';
import { useEditDashboardContext } from '~/contexts';
import { DataSourceType } from '~/model';
import { listDataSources } from '~/api-caller';
import { DBExplorerModal } from '../../db-explorer-modal';
import { IconVectorTriangle } from '@tabler/icons-react';

const DataSourceLabel = forwardRef<HTMLDivElement, { label: string; type: DataSourceType }>(
  ({ label, type, ...others }, ref) =>
    type === DataSourceType.Transform ? (
      <Group position="left" ref={ref} {...others}>
        <IconVectorTriangle size={14} color="#228be6" />
        <Text color="blue">{label}</Text>
      </Group>
    ) : (
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
  const model = useEditDashboardContext();
  const { data: dataSources = [], loading } = useRequest(
    listDataSources,
    {
      refreshDeps: [],
    },
    [],
  );

  const dataSourceOptions = useMemo(() => {
    const ret = dataSources.map((ds) => ({
      label: ds.key,
      value: ds.key,
      type: ds.type,
    }));
    ret.push({
      label: "Use other queries' data",
      value: DataSourceType.Transform,
      type: DataSourceType.Transform,
    });
    return ret;
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
      maxDropdownHeight={500}
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
