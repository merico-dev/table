import { ITemplateVariable, templateToString } from '~/utils/template';
import { ICartesianReferenceLine } from '../../type';

export function getReferenceLines(
  reference_lines: ICartesianReferenceLine[],
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
  data: TPanelData,
  xAxisData: string[],
) {
  return reference_lines.map((r) => {
    const value = variableValueMap[r.variable_key];
    const isHorizontal = r.orientation === 'horizontal';
    const keyOfAxis = isHorizontal ? 'yAxis' : 'xAxis';
    const position = isHorizontal ? 'insideEndTop' : 'end';
    const seriesData = isHorizontal ? [xAxisData[0], value] : [];
    return {
      name: r.name,
      type: 'scatter',
      hide_in_legend: !r.show_in_legend,
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
