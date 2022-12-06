import ReactEChartsCore from 'echarts-for-react/lib/core';
import 'echarts-gl';
import { BoxplotChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaults } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '~/types/plugin';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable, templateToString } from '~/utils/template';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, IBoxplotChartConf, IBoxplotReferenceLine } from './type';

echarts.use([
  DataZoomComponent,
  BoxplotChart,
  MarkLineComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

function getReferenceLines(reference_lines: IBoxplotReferenceLine[], variables: ITemplateVariable[], data: $TSFixMe[]) {
  const variableValueMap = variables.reduce((prev, variable) => {
    const value = getAggregatedValue(variable, data);
    prev[variable.name] = formatAggregatedValue(variable, value);
    return prev;
  }, {} as Record<string, string | number>);

  return reference_lines.map((r) => ({
    name: 'refs',
    type: 'scatter',
    data: [],
    markLine: {
      data: [
        {
          name: r.name,
          yAxis: Number(variableValueMap[r.variable_key]),
        },
      ],
      silent: true,
      symbol: ['none', 'none'],
      label: {
        formatter: function () {
          return templateToString(r.template, variables, data);
        },
        position: 'insideEndTop',
      },
    },
  }));
}

export function VizBoxplotChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IBoxplotChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data as $TSFixMe[];
  const { width, height } = context.viewport;
  const { x_axis, y_axis, color, reference_lines } = defaults({}, conf, DEFAULT_CONFIG);

  const { xAxisData, boxplotData } = useMemo(() => {
    const grouped = _.groupBy(data, x_axis.data_key);
    return {
      xAxisData: Object.keys(grouped),
      boxplotData: Object.values(grouped).map((group) => group.map((item) => item[y_axis.data_key])),
    };
  }, [data, x_axis.data_key, y_axis.data_key]);

  const option = {
    dataset: [
      {
        source: boxplotData,
      },
      {
        transform: {
          type: 'boxplot',
          config: {
            itemNameFormatter: function (params: { value: number }) {
              return xAxisData[params.value] ?? params.value;
            },
          },
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
      },
      {
        type: 'inside',
        yAxisIndex: [0],
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        type: 'category',
        name: x_axis.name,
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        name: y_axis.name,
        axisLine: {
          show: true,
        },
      },
    ],
    series: [
      {
        name: y_axis.name,
        type: 'boxplot',
        itemStyle: {
          color,
          borderColor: '#454545',
        },
        boxWidth: [10, 40],
        datasetIndex: 1,
      },
      ...getReferenceLines(reference_lines, variables, data),
    ],
  };
  if (!conf || !width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />;
}
