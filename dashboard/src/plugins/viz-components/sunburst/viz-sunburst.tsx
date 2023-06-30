import ReactEChartsCore from 'echarts-for-react/lib/core';
import { SunburstChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults, maxBy, merge } from 'lodash';
import { useMemo } from 'react';

import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, ISunburstConf } from './type';
import { getOption } from './option';

echarts.use([SunburstChart, CanvasRenderer]);

export function VizSunburst({ context }: VizViewProps) {
  const { variables } = context;
  const { value: confValue } = useStorageData<ISunburstConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);

  const data = context.data;
  const { width, height } = context.viewport;

  const option = useMemo(() => getOption(conf, data, variables), [conf, data, variables]);

  if (!width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} notMerge theme="merico-light" />;
}
