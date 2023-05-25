import numbro from 'numbro';
import { getLabelOverflowOptionOnAxis } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable, templateToString } from '~/utils/template';
import { getEchartsXAxisLabel } from '../../cartesian/editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IBoxplotChartConf, IBoxplotReferenceLine } from '../type';
import { getDataset } from './dataset';
import { getLegend } from './legend';
import { getSeries } from './series';
import { getTooltip } from './tooltip';

function getReferenceLines(reference_lines: IBoxplotReferenceLine[], variables: ITemplateVariable[], data: TVizData) {
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
  const { x_axis, y_axis, reference_lines } = config;
  const dataset = getDataset(config, data);

  const overflowOption = getLabelOverflowOptionOnAxis(x_axis.axisLabel.overflow.on_axis);
  const series = getSeries(config);
  return {
    dataset,
    legend: getLegend({ config }),
    tooltip: getTooltip({ config }),
    xAxis: [
      {
        type: 'category',
        name: x_axis.name,
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
        axisLabel: {
          ...x_axis.axisLabel,
          ...overflowOption,
          formatter: getEchartsXAxisLabel(x_axis.axisLabel.formatter),
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
    series: [...series, ...getReferenceLines(reference_lines, variables, data)],
  };
}
