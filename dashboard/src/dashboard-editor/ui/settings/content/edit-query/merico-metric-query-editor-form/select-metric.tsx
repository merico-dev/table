import {
  ActionIcon,
  Anchor,
  ComboboxItem,
  Group,
  Loader,
  Select,
  SelectProps,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconHash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { ErrorBoundary } from '~/utils';
import { MericoIconExternalLink } from './merico-icons';
import { MericoMetricQueryMetaInstance } from '~/model';

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
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metrics = mmInfo.metrics;
  useEffect(() => {
    metrics.load();
  }, [metrics]);

  useEffect(() => {
    if (!mmInfo.metricID && !!config.id) {
      mmInfo.selectMetric(config.id);
    }
  }, [config.id]);

  const options = useMemo(() => {
    return metrics.data.map((d) => ({
      label: d.name,
      value: d.id,
      description: d.description,
      type: d.type,
    }));
  }, [metrics.data]);

  const handleChange = useCallback(
    (id: string | null, option: any) => {
      if (!id) {
        return;
      }

      mmInfo.selectMetric(id);
      config.setID(id);
      config.setType(option.type);
    },
    [mmInfo, config],
  );

  const href = useMemo(() => {
    const base = window.localStorage.getItem('ee_site_url') ?? '';
    let ret = `${base}/dashboard/admin/metrics/list`;
    if (config.id && config.type) {
      ret = `${base}/dashboard/admin/metrics/details/${config.type}/${config.id}`;
    }
    return ret.replace('//dashboard', '/dashboard');
  }, [config.id, config.type]);

  const { loading, error } = metrics;
  return (
    <ErrorBoundary>
      <Group justify="flex-end" gap={12} align="flex-end">
        {error ? (
          <Tooltip label={error}>
            <Select size="xs" label="指标" error styles={{ root: { flexGrow: 1 } }} />
          </Tooltip>
        ) : (
          <Select
            size="xs"
            label="指标"
            data={options}
            renderOption={renderSelectOption}
            styles={{ root: { flexGrow: 1 } }}
            maxDropdownHeight={500}
            value={config.id}
            onChange={handleChange}
            rightSection={loading ? <Loader size="xs" /> : null}
          />
        )}
        <Tooltip label="跳转到指标明细页查看详情。" disabled={loading}>
          <Anchor size="md" variant="subtle" mb={2} href={href} target="_blank" underline="never">
            <MericoIconExternalLink width={14} height={14} />
          </Anchor>
        </Tooltip>
      </Group>
    </ErrorBoundary>
  );
});
