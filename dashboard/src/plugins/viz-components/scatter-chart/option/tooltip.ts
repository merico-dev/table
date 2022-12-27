import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import numbro from 'numbro';
import { AnyObject } from '~/types';
import { getEchartsXAxisLabel } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IScatterChartConf } from '../type';

function getXAxisLabel(params: AnyObject[], conf: IScatterChartConf) {
  const basis = params.find((p) => p.axisDim === 'x' && p.axisId === 'main-x-axis');
  if (!basis) {
    return '';
  }
  const { name, axisValue, axisIndex } = basis;
  if (!conf.x_axis.axisLabel.formatter.enabled) {
    return axisValue;
  }
  return getEchartsXAxisLabel(conf.x_axis.axisLabel.formatter)(axisValue, axisIndex);
}

export function getTooltip(conf: IScatterChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return {
    formatter: function (params: TopLevelFormatterParams) {
      const yLabelFormatter = labelFormatters[0] ?? labelFormatters.default;
      const arr = Array.isArray(params) ? params : [params];
      if (arr.length === 0) {
        return '';
      }
      const xAxisLabel = getXAxisLabel(arr, conf);
      // @ts-expect-error type of value
      const lines = arr.map(({ value }: { value: [string | number, string | number, string] }) => {
        return `
        <tr>
          <th style="text-align: right;">${value[2]}</th>
          <td style="text-align: right; padding-right: .5em;">${xAxisLabel}</td>
          <td style="text-align: right; padding-right: .5em;">
            ${yLabelFormatter(value[1])}
          </td>
        </tr>`;
      });

      const template = `
<table>
<thead>
  <tr>
    <th></th>
    <th style="text-align: left;">${conf.x_axis.name}</th>
    <th style="text-align: left;">${conf.y_axes[0].name}</th>
  </tr>
</thead>
<tbody>
  ${lines.join('')}
</tbody>
</table>
      `;
      return template;
    },
  };
}
