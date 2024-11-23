import { ActionIcon, ComboboxItem, Group, Select, SelectProps, Stack, Text, Tooltip } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconHash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { ErrorBoundary } from '~/utils';
import { MericoIconExternalLink } from './merico-icons';

type CustomOption = ComboboxItem & { description: string };
const renderSelectOption: SelectProps['renderOption'] = ({ option, ...rest }) => {
  const o = option as CustomOption;
  return (
    <Stack
      gap={0}
      py={4}
      styles={{
        root: {
          flexGrow: 1,
          '&[data-selected="true"]': { '.mantine-Text-root': { color: 'white' }, svg: { stroke: 'white' } },
        },
      }}
      {...rest}
    >
      <Group flex="1" gap={4}>
        <IconHash size={12} />
        <Text size="xs">{o.label}</Text>
      </Group>
      <Text ml={16} size="xs" c={rest.checked ? 'rgba(255,255,255,.8)' : 'dimmed'}>
        {o.description}
      </Text>
    </Stack>
  );
};

type Props = {
  queryModel: QueryModelInstance;
};

export const SelectMetric = observer(({ queryModel }: Props) => {
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  useEffect(() => {
    mmInfo.metrics.load();
  }, [mmInfo]);

  const options = useMemo(() => {
    return mmInfo.metrics.data.map((d) => ({
      label: d.name,
      value: d.id,
      description: d.description,
    }));
  }, [mmInfo.metrics.data]);

  return (
    <ErrorBoundary>
      <Group justify="flex-end" gap={4} align="flex-end">
        <Select
          size="xs"
          label="指标"
          data={options}
          renderOption={renderSelectOption}
          styles={{ root: { flexGrow: 1 } }}
          maxDropdownHeight={500}
          value={mmInfo.metricID}
          onChange={mmInfo.selectMetric}
        />
        <Tooltip label="跳转到指标明细页查看详情。">
          <ActionIcon
            size="md"
            variant="subtle"
            mb={2}
            onClick={() => showNotification({ message: 'TODO', color: 'red' })}
          >
            <MericoIconExternalLink width={14} height={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </ErrorBoundary>
  );
});
