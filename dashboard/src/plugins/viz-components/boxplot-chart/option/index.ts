import _, { maxBy, minBy } from 'lodash';
import numbro from 'numbro';
import { AnyObject } from '~/types';
import { aggregateValue } from '~/utils/aggregation';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable, templateToString } from '~/utils/template';
import { IBoxplotChartConf, IBoxplotDataItem, IBoxplotReferenceLine } from '../type';
import { BOXPLOT_DATA_ITEM_KEYS } from './common';
import { getTooltip } from './tooltip';

function calcBoxplotData(groupedData: Record<string, AnyObject[]>, data_key: string) {
  const ret = Object.entries(groupedData).map(([name, data]) => {
    const q1 = aggregateValue(data, data_key, { type: 'quantile', config: { p: 0.25 } });
    const q3 = aggregateValue(data, data_key, { type: 'quantile', config: { p: 0.75 } });
    const median = aggregateValue(data, data_key, { type: 'median', config: {} });
    const IQR = q3 - q1;
    const minLimit = q1 - 1.5 * IQR;
    const maxLimit = q1 + 1.5 * IQR;
    const dataPoints = data.map((d) => [name, d[data_key]] as [string, number]);
    const validPoints = dataPoints.filter((p) => minLimit <= p[1] && p[1] <= maxLimit);
    const outliers = dataPoints.filter((p) => p[1] < minLimit || p[1] > maxLimit);
    return {
      name,
      min: minBy(validPoints, (p) => p[1])?.[1] ?? -1,
      q1,
      median,
      q3,
      max: maxBy(validPoints, (p) => p[1])?.[1] ?? -1,
      outliers,
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
  const grouped = _.groupBy(data, x_axis.data_key);
  const boxplotData = calcBoxplotData(grouped, y_axis.data_key);
  const outliersData = boxplotData.map((b) => b.outliers).flat();

  return {
    dataset: [
      {
        source: boxplotData,
      },
      {
        source: outliersData,
      },
    ],
    tooltip: getTooltip({ config }),
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
          borderColor: '#2F8CC0',
          borderWidth: 2,
        },
        emphasis: {
          disabled: true,
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
      {
        name: y_axis.name,
        type: 'scatter',
        symbolSize: 5,
        itemStyle: {
          color,
        },
        emphasis: {
          scale: 2,
        },
        datasetIndex: 1,
      },
      ...getReferenceLines(reference_lines, variables, data),
    ],
  };
}
