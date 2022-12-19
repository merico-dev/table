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
import { AnyObject } from '~/types';
import { aggregateValue } from '~/utils/aggregation';
import { TopLevelFormatterParams } from 'echarts/types/dist/shared';

echarts.use([
  DataZoomComponent,
  BoxplotChart,
  MarkLineComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

interface IBoxplotDataItem {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}
const BOXPLOT_DATA_ITEM_KEYS: Array<keyof IBoxplotDataItem> = ['min', 'q1', 'median', 'q3', 'max'];

function calcBoxplotData(groupedData: Record<string, AnyObject[]>, data_key: string) {
  const ret = Object.entries(groupedData).map(([name, data]) => {
    return {
      name,
      min: aggregateValue(data, data_key, { type: 'min', config: {} }),
      q1: aggregateValue(data, data_key, { type: 'quantile', config: { p: 0.25 } }),
      median: aggregateValue(data, data_key, { type: 'median', config: {} }),
      q3: aggregateValue(data, data_key, { type: 'quantile', config: { p: 0.75 } }),
      max: aggregateValue(data, data_key, { type: 'max', config: {} }),
    } as IBoxplotDataItem;
  });
  return ret;
}

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

  const boxplotData = useMemo(() => {
    const grouped = _.groupBy(data, x_axis.data_key);
    return calcBoxplotData(grouped, y_axis.data_key);
  }, [data, x_axis.data_key, y_axis.data_key]);

  const option = {
    dataset: [
      {
        source: boxplotData,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: TopLevelFormatterParams) {
        if (!Array.isArray(params) || params.length === 0) {
          return;
        }

        const value = params[0].value as IBoxplotDataItem;
        const lines = BOXPLOT_DATA_ITEM_KEYS.map((key) => {
          // @ts-expect-error name is string while others are number
          return `${key}: <strong>${_.round(value[key], 2)}</strong>`;
        });
        lines.unshift(`<strong>${value.name}</strong>`);
        return lines.join('<br />');
      },
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
        datasetIndex: 0,
        encode: {
          y: BOXPLOT_DATA_ITEM_KEYS,
          x: 'name',
          itemName: ['name'],
          tooltip: BOXPLOT_DATA_ITEM_KEYS,
        },
      },
      ...getReferenceLines(reference_lines, variables, data),
    ],
  };
  if (!conf || !width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />;
}
