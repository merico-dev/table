import { Loader, MultiSelect } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';

type Props = {
  queryModel: QueryModelInstance;
};
export const SetGroupByMetrics = observer(({ queryModel }: Props) => {
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metric = mmInfo.metricDetail;
  const loading = mmInfo.metrics.loading || metric.loading;

  const options = metric.groupByColOptions;
  console.log('GroupBy Metrics:', options);
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
      }}
      rightSection={loading ? <Loader size="xs" /> : null}
    />
  );
});
