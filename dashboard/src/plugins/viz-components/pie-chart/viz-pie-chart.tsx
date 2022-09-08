import ReactEChartsCore from 'echarts-for-react/lib/core';
import { PieChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults, merge, set } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, IPieChartConf } from './type';

echarts.use([PieChart, CanvasRenderer]);

const defaultOption = {
  tooltip: {
    show: true,
  },
  series: {
    type: 'pie',
    radius: ['50%', '80%'],
    label: {
      position: 'outer',
      alignTo: 'edge',
      formatter: '{name|{b}}\n{percentage|{d}%}',
      minMargin: 5,
      edgeDistance: 10,
      lineHeight: 15,
      rich: {
        percentage: {
          color: '#999',
        },
      },
      margin: 20,
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
    right: 10,
  },
};

export function VizPieChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IPieChartConf>(context.instanceData, 'config');
  const data = context.data as any[];
  const { width, height } = context.viewport;
  const { label_field, value_field } = defaults({}, conf, DEFAULT_CONFIG);
  const chartData = useMemo(() => {
    return data.map((d) => ({
      name: d[label_field],
      value: Number(d[value_field]),
    }));
  }, [data, label_field, value_field]);

  const labelOptions = useMemo(() => {
    return {
      series: {
        labelLayout: function (params: any) {
          const isLeft = params.labelRect.x < width / 2;
          const points = params.labelLinePoints;
          set(points, [2, 0], isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width);
          return {
            labelLinePoints: points,
          };
        },
      },
    };
  }, [width]);

  const option = merge({}, defaultOption, labelOptions, { series: { data: chartData } });

  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />;
}
