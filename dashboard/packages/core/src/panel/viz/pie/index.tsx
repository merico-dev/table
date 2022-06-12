import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";
import React from 'react';

echarts.use([PieChart, CanvasRenderer]);

interface IVizPie {
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
    type: 'pie',
    radius: ['50%', '80%'],
    label: {
      position: 'outer',
      alignTo: 'edge',
      formatter: '{name|{b}}\n{value|{c}}',
      minMargin: 5,
      edgeDistance: 10,
      lineHeight: 15,
      rich: {
        value: {
          fontSize: 10,
          color: '#999'
        }
      },
      margin: 20
    },
    labelLine: {
      length: 15,
      length2: 0,
      maxSurfaceAngle: 80,
      showAbove: true,
    },
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  }
};

export function VizPie({ conf, data, width, height }: IVizPie) {
  const { label_field = 'name', value_field = 'value', ...restConf } = conf

  const chartData = React.useMemo(() => {
    return data.map(d => ({
      name: d[label_field],
      value: Number(d[value_field]),
    }));
  }, [data, label_field, value_field]);

  const labelOptions = React.useMemo(() => {
    return {
      labelLayout: function (params: any) {
        const isLeft = params.labelRect.x < width / 2;
        const points = params.labelLinePoints;
        points[2][0] = isLeft
          ? params.labelRect.x
          : params.labelRect.x + params.labelRect.width;
        return {
          labelLinePoints: points
        };
      },
    }
  }, [width]);

  const option = _.merge({}, defaultOption, labelOptions, restConf, { series: { data: chartData } });

  return (
    <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
  )
}