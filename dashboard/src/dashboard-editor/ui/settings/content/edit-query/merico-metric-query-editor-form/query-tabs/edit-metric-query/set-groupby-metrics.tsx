import { Combobox, Group, Loader, MultiSelect, MultiSelectProps, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { DimensionColDataType } from '~/dashboard-editor/model/datasources/mm-info';
import { DimensionIcon } from './dimension-selector/dimension-icon';
import { MericoMetricQueryMetaInstance } from '~/model';

type CustomOption = {
  label: string;
  value: string;
  description: string;
  dataType: DimensionColDataType | null;
};

const renderOption: MultiSelectProps['renderOption'] = (item) => {
  const option = item.option as CustomOption;
  return (
    <Combobox.Option key={option.value} value={option.value}>
      <Stack gap={1}>
        <Group gap={4}>
          <DimensionIcon type={option.dataType} />
          <Text size="xs">{option.label}</Text>
        </Group>
        <Text size="xs" c="dimmed" pl={18}>
          {option.description}
        </Text>
      </Stack>
    </Combobox.Option>
  );
};

type Props = {
  queryModel: QueryModelInstance;
};
export const SetGroupByMetrics = observer(({ queryModel }: Props) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;

  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metric = mmInfo.metricDetail;
  const loading = mmInfo.metrics.loading || metric.loading;

  const options = metric.groupByColOptions;
  return (
    <MultiSelect
      size="sm"
      label="分组聚合维度"
      description="指标在查询时按照哪些维度进行聚合计算。最多支持两个维度的聚合计算。若选择按时间序列展示，则仅可选择一个聚合维度。"
      data={options}
      searchable
      styles={{
        label: {
          fontWeight: 'normal',
        },
        input: {
          fontSize: '12px',
        },
      }}
      renderOption={renderOption}
      rightSection={loading ? <Loader size="xs" /> : null}
      value={[...config.groupBys]}
      onChange={config.setGroupBys}
      maxValues={config.timeQuery.enabled ? 1 : 2}
      placeholder={config.timeQuery.enabled ? '最多选一个维度' : '最多选两个维度'}
    />
  );
});
