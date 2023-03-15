import { AnyObject } from '~/types';
import { ITemplateVariable, templateToString } from '~/utils/template';
import { IHorizontalBarChartReferenceLine } from '../../type';

export function getReferenceLines(
  reference_lines: IHorizontalBarChartReferenceLine[],
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
  data: AnyObject[],
) {
  return reference_lines.map((r) => {
    const isHorizontal = r.orientation === 'horizontal';
    const keyOfAxis = isHorizontal ? 'yAxis' : 'xAxis';
    const position = isHorizontal ? 'insideEndTop' : 'end';
    return {
      name: r.name,
      type: 'line',
      hide_in_legend: !r.show_in_legend,
      xAxisIndex: r.xAxisIndex,
      data: [],
      lineStyle: r.lineStyle,
      markLine: {
        data: [
          {
            name: r.name,
            [keyOfAxis]: Number(variableValueMap[r.variable_key]),
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
