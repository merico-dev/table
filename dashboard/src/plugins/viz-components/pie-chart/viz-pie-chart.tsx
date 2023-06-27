import ReactEChartsCore from 'echarts-for-react/lib/core';
import { PieChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { DEFAULT_CONFIG, IPieChartConf } from './type';

echarts.use([PieChart, CanvasRenderer]);

export function VizPieChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IPieChartConf>(context.instanceData, 'config');
  const data = context.data;
  const { width, height } = context.viewport;

  const option = useMemo(() => {
    return getOption(defaultsDeep({}, conf, DEFAULT_CONFIG), data, width);
  }, [conf, data, width]);

  if (!width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} notMerge theme="merico-light" />;
}
