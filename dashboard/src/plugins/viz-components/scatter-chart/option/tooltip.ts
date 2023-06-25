import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import numbro from 'numbro';
import { getLabelOverflowStyleInTooltip } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { getEchartsXAxisLabel } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IScatterChartConf } from '../type';
import { parseDataKey, readColumnIgnoringQuery } from '~/utils/data';

function formatXAxisLabel(value: string | number, index: number, conf: IScatterChartConf) {
  const { x_axis } = conf;
  if (!x_axis.axisLabel.formatter.enabled) {
    return value;
  }
  return getEchartsXAxisLabel(x_axis.axisLabel.formatter)(value, index);
}

function getXAxisLabel(params: AnyObject[], conf: IScatterChartConf) {
  const { x_axis, tooltip } = conf;
  if (tooltip.trigger === 'item') {
    const axisValue = readColumnIgnoringQuery(params[0].data, x_axis.data_key);
    const axisIndex = 0;
    return formatXAxisLabel(axisValue, axisIndex, conf);
  }

  const basis = params.find((p) => p.axisDim === 'x' && p.axisId === 'main-x-axis');
  if (!basis) {
    return '';
  }
  const { axisValue, axisIndex } = basis;
  return formatXAxisLabel(axisValue, axisIndex, conf);
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
  const { scatter, tooltip } = conf;
  return {
    confine: true,
    trigger: tooltip.trigger,
    formatter: function (params: TopLevelFormatterParams) {
      const yLabelFormatter = labelFormatters[0] ?? labelFormatters.default;
      const arr = Array.isArray(params) ? params : [params];
      if (arr.length === 0) {
        return '';
      }
      const xAxisLabel = getXAxisLabel(arr, conf);

      const xAxisLabelStyle = getLabelOverflowStyleInTooltip(conf.scatter.label_overflow.tooltip);
      const headers = arr.map(
        // @ts-expect-error type of value
        ({ value }: { value: AnyObject }) =>
          `
          <th style="text-align: right; padding-right: 1em">
            <div style="${xAxisLabelStyle}">${readColumnIgnoringQuery(value, scatter.name_data_key)}</div>
          </th>
          `,
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
              return `
              <td style="text-align: right; padding: 0 1em;">
                ${yLabelFormatter(readColumnIgnoringQuery(value, scatter.y_data_key))}
              </td>`;
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
            return `<td style="text-align: right; padding: 0 1em;">${formatAdditionalMetric(
              readColumnIgnoringQuery(value, m.data_key),
            )}</td>`;
          })
          .join('')}
      </tr>`;
      });
      metrics.push(...additionalMetrics);

      const template = `
      <table style="width: auto">
        <thead><tr>${headers.join('')}</tr></thead>
        <tbody>${metrics.join('')}</tbody>
      </table>
      `;

      return template;
    },
  };
}
