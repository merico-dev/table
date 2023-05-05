import { Box } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';
import { Toolbox } from './toolbox';

echarts.use([
  BarChart,
  LineChart,
  HeatmapChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
  VisualMapComponent,
]);

function Chart({
  conf,
  data,
  width,
  height,
  metricKey,
}: {
  conf: IMericoEstimationChartConf;
  data: TVizData;
  width: number;
  height: number;
  metricKey: string;
}) {
  const option = React.useMemo(() => {
    return getOption(conf, metricKey, data);
  }, [conf, data, metricKey]);

  if (!width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} notMerge theme="merico-light" />;
}

export function VizMericoEstimationChart({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IMericoEstimationChartConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data as TVizData;
  const { width, height } = context.viewport;
  const { x_axis, deviation } = conf;
  const { estimated_value, actual_value } = deviation.data_keys;
  const [metricKey, setMetricKey] = useState(actual_value);
  useEffect(() => {
    setMetricKey((m) => (m ? m : actual_value));
  }, [actual_value]);

  if (!x_axis.data_key || !estimated_value || !actual_value) {
    return null;
  }
  const finalWidth = Math.max(width, 300);
  const finalHeight = Math.max(height, 370);
  return (
    <Box sx={{ overflow: 'hidden', height: finalHeight, width: finalWidth }}>
      <Toolbox conf={conf} metricKey={metricKey} setMetricKey={setMetricKey} />
      <Chart width={finalWidth} height={finalHeight - 30} data={data} conf={conf} metricKey={metricKey} />
    </Box>
  );
}
