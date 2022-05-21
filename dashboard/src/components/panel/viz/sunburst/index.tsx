import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { SunburstChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";
import React from 'react';

echarts.use([SunburstChart, CanvasRenderer]);

interface ISunbrust {
  conf: any;
  data: any[];
  width: number;
  height: number;
}

const defaultOption = {
  tooltip: {
    show: true
  },
  series: {
    type: "sunburst",
    radius: [
      0,
      "90%"
    ],
    emphasis: {
      focus: "ancestor"
    }
  }
};

export function Sunbrust({ conf, data, width, height }: ISunbrust) {
  const { label_field = 'name', value_field = 'value', ...restConf } = conf

  const chartData = React.useMemo(() => {
    return data.map(d => ({
      name: d[label_field],
      value: d[value_field],
    }));
  }, [data, label_field, value_field]);

  const max = React.useMemo(() => _.maxBy(chartData, d => d.value)?.value ?? 1, [chartData]);

  const labelOption = React.useMemo(() => ({
    series: {
      label: {
        formatter: ({ name, value }: any) => {
          if (value / max < 0.2) {
            return ' ';
          }
          return name;
        }
      }
    }
  }), []);
  const option = _.assign(defaultOption, labelOption, restConf, { series: { data: chartData } });

  return (
    <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
  )
}