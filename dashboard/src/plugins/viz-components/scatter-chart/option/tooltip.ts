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

const formatAdditionalMetric = (v: number) => {
  try {
    return numbro(v).format({
      trimMantissa: true,
      mantissa: 2,
    });
  } catch (error) {
    return v;
  }
};

export function getTooltip(conf: IScatterChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  const { scatter } = conf;
  return {
    confine: true,
    formatter: function (params: TopLevelFormatterParams) {
      const yLabelFormatter = labelFormatters[0] ?? labelFormatters.default;
      const arr = Array.isArray(params) ? params : [params];
      if (arr.length === 0) {
        return '';
      }
      const xAxisLabel = getXAxisLabel(arr, conf);

      const headers = arr.map(
        // @ts-expect-error type of value
        ({ value }: { value: AnyObject }) =>
          `<th style="text-align: right; padding-right: 1em">${value[scatter.name_data_key]}</th>`,
      );
      headers.unshift('<th></th>');

      const metrics = [
        `<tr>
          <th style="text-align: right;">${conf.x_axis.name}</th>
          ${arr.map((i) => `<td style="text-align: right; padding: 0 1em;">${xAxisLabel}</td>`).join('')}
        </tr>`,
        `<tr>
          <th style="text-align: right;">${conf.y_axes[0].name}</th>
          ${arr
            // @ts-expect-error type of value
            .map(({ value }: { value: AnyObject }) => {
              return `<td style="text-align: right; padding: 0 1em;">${yLabelFormatter(
                value[scatter.y_data_key],
              )}</td>`;
            })
            .join('')}
        </tr>`,
      ];

      const additionalMetrics = conf.tooltip.metrics.map((m) => {
        return `<tr>
        <th style="text-align: right;">${m.name}</th>
        ${arr
          // @ts-expect-error type of value
          .map(({ value }: { value: AnyObject }) => {
            return `<td style="text-align: right; padding: 0 1em;">${formatAdditionalMetric(value[m.data_key])}</td>`;
          })
          .join('')}
      </tr>`;
      });
      metrics.push(...additionalMetrics);

      const template = `
      <table>
        <thead><tr>${headers.join('')}</tr></thead>
        <tbody>${metrics.join('')}</tbody>
      </table>
      `;

      return template;
    },
  };
}
