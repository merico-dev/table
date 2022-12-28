import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import _ from 'lodash';
import numbro from 'numbro';
import { useMemo } from 'react';
import { AnyObject } from '~/types';
import { aggregateValue } from '~/utils/aggregation';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable, templateToString } from '~/utils/template';
import { IBoxplotChartConf, IBoxplotDataItem, IBoxplotReferenceLine } from '../type';

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

interface IGetOption {
  config: IBoxplotChartConf;
  data: AnyObject[];
  variables: ITemplateVariable[];
}
export function getOption({ config, data, variables }: IGetOption) {
  const { x_axis, y_axis, color, reference_lines } = config;
  const boxplotData = useMemo(() => {
    const grouped = _.groupBy(data, x_axis.data_key);
    return calcBoxplotData(grouped, y_axis.data_key);
  }, [data, x_axis.data_key, y_axis.data_key]);

  return {
    dataset: [
      {
        source: boxplotData,
      },
    ],
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: function (params: TopLevelFormatterParams) {
        if (!Array.isArray(params) || params.length === 0) {
          return;
        }

        const value = params[0].value as IBoxplotDataItem;
        const lines = BOXPLOT_DATA_ITEM_KEYS.map((key) => {
          return `
          <tr>
            <td>${_.capitalize(key)}</td>
            <td style="text-align: right;">
              ${numbro(value[key]).format(y_axis.label_formatter)}
            </td>
          </tr>`;
        });

        const template = `
<table>
  <thead>
    <tr>
      <th colspan="2" style="text-align: left;">${value.name}</th>
    </tr>
  </thead>
  <tbody>
    ${lines.join('')}
  </tbody>
</table>
        `;
        return template;
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
        axisLabel: {
          formatter: function (value: number) {
            return numbro(value).format(y_axis.label_formatter);
          },
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
}
