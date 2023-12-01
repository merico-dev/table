import { formatAggregatedValue, getAggregatedValue, ITemplateVariable, templateToString } from '~/utils';
import { IBoxplotReferenceLine } from '../type';

export function getReferenceLines(
  reference_lines: IBoxplotReferenceLine[],
  variables: ITemplateVariable[],
  data: TPanelData,
) {
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
      symbol: ['none', 'triangle'],
      symbolRotate: 90,
      symbolSize: [10, 8],
      label: {
        formatter: function () {
          return templateToString(r.template, variables, data);
        },
        position: 'insideEndTop',
      },
    },
  }));
}
