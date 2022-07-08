import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
/* @ts-expect-error */
import { transform } from 'echarts-stat';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";
import React from 'react';
import { getOption } from './option';
import { ICartesianChartConf } from './type';

echarts.use([BarChart, LineChart, ScatterChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);
echarts.registerTransform(transform.regression);

interface ICartesianChart {
  conf: ICartesianChartConf;
  data: any[];
  width: number;
  height: number;
}

export function VizCartesianChart({ conf, data, width, height }: ICartesianChart) {
  const option = React.useMemo(() => {
    return getOption(conf, data);
  }, [conf, data])

  if (!width || !height) {
    return null;
  }
  return (
    <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
  )
}