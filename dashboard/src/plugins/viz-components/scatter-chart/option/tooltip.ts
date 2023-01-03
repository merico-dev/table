import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
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
  const { scatter } = conf;
  return {
    formatter: function (params: TopLevelFormatterParams) {
      const yLabelFormatter = labelFormatters[0] ?? labelFormatters.default;
      const arr = Array.isArray(params) ? params : [params];
      if (arr.length === 0) {
        return '';
      }
      const xAxisLabel = getXAxisLabel(arr, conf);
      // @ts-expect-error type of value
      const lines = arr.map(({ value }: { value: AnyObject }) => {
        return `
        <tr>
          <th style="text-align: right;">${value[scatter.name_data_key]}</th>
          <td style="text-align: right; padding-right: .5em;">${xAxisLabel}</td>
          <td style="text-align: right; padding-right: .5em;">
            ${yLabelFormatter(value[scatter.y_data_key])}
          </td>
          ${conf.tooltip.metrics
            .map((m) => {
              return `<td style="text-align: right; padding-right: .5em;">${value[m.data_key]}</td>`;
            })
            .join('')}
        </tr>`;
      });

      const template = `
<table>
<thead>
  <tr>
    <th></th>
    <th style="text-align: left;">${conf.x_axis.name}</th>
    <th style="text-align: left;">${conf.y_axes[0].name}</th>
    ${conf.tooltip.metrics
      .map((m) => {
        return `<th style="text-align: left;">${m.name}</th>`;
      })
      .join('')}
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
