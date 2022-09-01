import { Box, Text } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { ScatterChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
/* @ts-expect-error */
import { transform } from 'echarts-stat';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { getOption } from './option';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';
import { getRegressionDescription } from './option/regression';

echarts.use([ScatterChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);
echarts.registerTransform(transform.regression);

export function VizRegressionChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;
  const data = context.data as any[];
  const option = useMemo(() => {
    return getOption(defaultsDeep({}, conf, DEFAULT_CONFIG), data);
  }, [conf, data]);

  const { expression, gradient, intercept } = useMemo(() => {
    return getRegressionDescription(data, conf);
  }, [conf, data]);

  if (!width || !height || !conf) {
    return null;
  }
  return (
    <Box>
      {expression && (
        <Text align="center" size={14}>
          {expression}
        </Text>
      )}
      <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
    </Box>
  );
}
