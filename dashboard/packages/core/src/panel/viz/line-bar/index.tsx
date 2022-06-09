import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";
import React from 'react';
import numbro from 'numbro';

echarts.use([BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const defaultOption = {
  legend: {
    show: true
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {},
  grid: {
    top: 30,
    left: 10,
    right: 10,
    bottom: 10,
    containLabel: true,
  }
}

interface ILineBarChart {
  conf: any;
  data: any[];
  width: number;
  height: number;
}

export function VizLineBarChart({ conf, data, width, height }: ILineBarChart) {
  const option = React.useMemo(() => {
    const dataset = {
      dataset: { source: data }
    };
    const xAxisSource = {
      xAxis: {
        data: data.map((d) => d[conf.x_axis_data_key]),
      }
    }
    const series = conf.series.map(({ y_axis_data_key, y_axis_data_formatter, ...rest }: any) => {
      const ret = {
        data: data.map((d) => d[y_axis_data_key]),
        label: {
          show: true,
          position: 'top'
        },
        ...rest,
      }
      if (y_axis_data_formatter) {
        ret.label.formatter = function formatter({ value }: any) {
          try {
            const v = numbro(value).format(JSON.parse(y_axis_data_formatter))
            return v;
          } catch (error) {
            console.error(error)
            return value;
          }
        }
      }
      return ret;
    });
    return _.assign({}, defaultOption, dataset, xAxisSource, { series });
  }, [conf, data])

  if (!width || !height) {
    return null;
  }
  return (
    <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
  )
}