import { Box, ComboboxItem, Group, Select, SelectProps, Text } from '@mantine/core';
import { IconVectorTriangle } from '@tabler/icons-react';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { listDataSources } from '~/api-caller';
import { useEditDashboardContext } from '~/contexts';
import { DataSourceType } from '~/model';
import { DBExplorerModal } from '../../db-explorer-modal';

type CustomOption = { label: string; type: DataSourceType } & ComboboxItem;
const DataSourceLabel: SelectProps['renderOption'] = ({ option, ...others }) => {
  const { label, type } = option as CustomOption;
  if (type === DataSourceType.Transform) {
    return (
      <Group
        className="transform-query-option"
        justify="flex-start"
        {...others}
        sx={{
          flexGrow: 1,
          '&[data-selected="true"]': { '.mantine-Text-root': { color: 'white' }, svg: { stroke: 'white' } },
        }}
      >
        <IconVectorTriangle size={14} color="#228be6" />
        <Text size="sm" c="blue">
          {label}
        </Text>
      </Group>
    );
  }
  return (
    <Group justify="space-between" {...others} sx={{ flexGrow: 1 }}>
      <Text size="sm">{label}</Text>
      <Text size="sm">{type}</Text>
    </Group>
  );
};
interface ISelectDataSource {
  value: { type: DataSourceType; key: string };
  onChange: (v: { type: DataSourceType; key: string }) => void;
}
export const SelectDataSource = observer(({ value, onChange }: ISelectDataSource) => {
  const { t } = useTranslation();
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
      label: t('query.transform.data_source'),
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

  const handleChange = (key: string | null) => {
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
        <Group justify="space-between">
          <Box>{t('data_source.label')}</Box>
          {dataSource && (
            <DBExplorerModal dataSource={dataSource} triggerButtonProps={{ size: 'compact-xs', px: 10 }} />
          )}
        </Group>
      }
      renderOption={DataSourceLabel}
      rightSection={
        dataSource ? (
          <Text size="xs" c="dimmed">
            {dataSource.type}
          </Text>
        ) : undefined
      }
      rightSectionWidth={85}
      maxDropdownHeight={500}
      styles={{
        root: { flex: 1 },
        label: { display: 'block' },
        section: {
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
