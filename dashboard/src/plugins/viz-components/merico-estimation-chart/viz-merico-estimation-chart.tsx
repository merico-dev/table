import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults } from 'lodash';
import React, { useMemo } from 'react';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';

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
}: {
  conf: IMericoEstimationChartConf;
  data: TVizData;
  width: number;
  height: number;
}) {
  const option = React.useMemo(() => {
    return getOption(conf, data);
  }, [conf, data]);

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
  const { x_axis, y_axis } = conf;
  const { estimated_level, actual_level, diff_level } = y_axis.data_keys;
  if (!x_axis.data_key || !actual_level || !diff_level) {
    return null;
  }
  return <Chart width={width} height={height} data={data} conf={conf} />;
}
