import { ITemplateVariable, templateToString } from '~/utils';
import { ICartesianChartConf, ICartesianReferenceLine } from '../../type';

function getInvisibleScatterData(
  value: string | number,
  isHorizontal: boolean,
  xAxisData: string[],
  xAxisType: ICartesianChartConf['x_axis']['type'],
) {
  if (!isHorizontal) {
    return [];
  }
  if (xAxisType === 'value') {
    return [[xAxisData[0], value]];
  } else {
    return [value];
  }
}

export function getReferenceLines(
  reference_lines: ICartesianReferenceLine[],
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
  data: TPanelData,
  xAxisData: string[],
  xAxisType: ICartesianChartConf['x_axis']['type'],
) {
  return reference_lines.map((r) => {
    const value = variableValueMap[r.variable_key];
    const isHorizontal = r.orientation === 'horizontal';
    const keyOfAxis = isHorizontal ? 'yAxis' : 'xAxis';
    const position = isHorizontal ? 'insideEndTop' : 'end';
    const seriesData = getInvisibleScatterData(value, isHorizontal, xAxisData, xAxisType);
    return {
      name: r.name,
      type: 'scatter',
      hide_in_legend: !r.show_in_legend,
      xAxisId: 'main-x-axis',
      yAxisIndex: r.yAxisIndex,
      data: seriesData,
      symbol: 'none',
      silent: true,
      tooltip: { show: false },
      markLine: {
        data: [
          {
            name: r.name,
            [keyOfAxis]: value,
          },
        ],
        silent: true,
        symbol: ['none', 'none'],
        lineStyle: r.lineStyle,
        label: {
          formatter: function () {
            if (!r.template) {
              return '';
            }
            return templateToString(r.template, variables, data);
          },
          position,
        },
      },
    };
  });
}
