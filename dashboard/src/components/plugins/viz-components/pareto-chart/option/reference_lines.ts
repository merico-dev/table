import { ITemplateVariable, templateToString } from '~/utils';
import { ICartesianReferenceLine } from '../../cartesian/type';

function getInvisibleScatterData(value: string | number, isHorizontal: boolean) {
  if (!isHorizontal) {
    return [];
  }
  return [value];
}

export function getReferenceLines(
  reference_lines: ICartesianReferenceLine[],
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
  data: TPanelData,
) {
  return reference_lines.map((r) => {
    const value = variableValueMap[r.variable_key];
    const isHorizontal = r.orientation === 'horizontal';
    const keyOfAxis = isHorizontal ? 'yAxis' : 'xAxis';
    const position = isHorizontal ? 'insideEndTop' : 'end';
    const seriesData = getInvisibleScatterData(value, isHorizontal);
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
