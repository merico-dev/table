import { Box, Switch, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { MericoMetricQueryMetaInstance } from '~/model';

type Props = {
  queryModel: QueryModelInstance;
};

export const TimeQuerySwitch = observer(({ queryModel }: Props) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metric = mmInfo.metricDetail;
  const trendingDateCol = metric.trendingDateCol;

  const enabled = config.timeQuery.enabled;
  useEffect(() => {
    if (!enabled && metric.requireTrendingReason) {
      config.setTimeQueryEnabled(true);
      return;
    }
  }, [metric.requireTrendingReason, enabled]);

  if (!metric.supportTrending) {
    return (
      <Tooltip label="由于指标未设定时序维度，所以不具备时间序列展示功能。">
        <Box>
          <Switch size="xs" color="red" disabled={!trendingDateCol} />
        </Box>
      </Tooltip>
    );
  }
  if (metric.requireTrendingReason) {
    return (
      <Tooltip label={metric.requireTrendingReason}>
        <Box>
          <Switch size="xs" color="red" checked readOnly styles={{ track: { cursor: 'not-allowed' } }} />
        </Box>
      </Tooltip>
    );
  }
  return (
    <Switch
      size="xs"
      color="red"
      checked={enabled}
      onChange={(e) => config.setTimeQueryEnabled(e.currentTarget.checked)}
      styles={{ track: { cursor: 'pointer' } }}
    />
  );
});
