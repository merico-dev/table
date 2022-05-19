import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";
import React from 'react';

echarts.use([BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

interface ILineChart {
  conf: any;
  data: any[];
  width: number;
  height: number;
}

export function VizLineChart({ conf, data, width, height }: ILineChart) {
  const xAxisData = React.useMemo(() => {
    return data.map((d) => d[conf.x_axis_data_key]);
  }, [data, conf.x_axis_data_key])

  const series = React.useMemo(() => {
    return conf.series.map(({ y_key, ...rest }: any) => ({
      data: data.map((d) => d[y_key]),
      ...rest,
    }))
  }, [data, conf.series])

  const option = {
    ...conf,
    dataset: {
      source: data,
    },
    xAxis: {
      ...conf.xAxis,
      data: xAxisData
    },
    series
  };
  return (
    <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
  )
}