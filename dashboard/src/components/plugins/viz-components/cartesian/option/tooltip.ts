import { CallbackDataParams } from 'echarts/types/dist/shared';
import { getLabelOverflowStyleInTooltip } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { ICartesianChartConf } from '../type';
import { IAxisLabels } from './get-axis-labels';
import { IEchartsSeriesItem } from './utils/types';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { extractData, formatNumber } from '~/utils';
import _ from 'lodash';

function getXAxisLabel(params: AnyObject[], xAxisLabels: IAxisLabels) {
  const basis = params.find((p) => p.axisDim === 'x' && p.axisId === 'main-x-axis');
  if (!basis) {
    return '';
  }
  const { axisValue, axisIndex } = basis;
  return xAxisLabels.labelFormatter(axisValue, axisIndex);
}

const formatAdditionalMetric = (v: number) => {
  return formatNumber(v, {
    output: 'number',
    trimMantissa: true,
    mantissa: 2,
    absolute: false,
  });
};

export function getTooltip(
  conf: ICartesianChartConf,
  data: TPanelData,
  series: IEchartsSeriesItem[],
  xAxisLabels: IAxisLabels,
  labelFormatters: Record<string, (p: $TSFixMe) => string>,
) {
  const yAxisIndexMap = series.reduce((ret, { yAxisIndex, name }) => {
    ret[name] = yAxisIndex;
    return ret;
  }, {} as Record<string, number>);

  const unitMap = conf.series.reduce((ret, { unit, name }) => {
    if (unit.show_in_tooltip) {
      ret[name] = unit.text;
    }
    return ret;
  }, {} as Record<string, string>);

  const metricUnitMap = conf.tooltip.metrics.reduce((ret, { unit, name }) => {
    if (unit.show_in_tooltip) {
      ret[name] = unit.text;
    }
    return ret;
  }, {} as Record<string, string>);

  return defaultEchartsOptions.getTooltip({
    trigger: 'axis',
    formatter: function (params: CallbackDataParams[]) {
      const arr = Array.isArray(params) ? params : [params];
      if (arr.length === 0) {
        return '';
      }
      const lines = arr.map(({ seriesName, marker, value }) => {
        if (Array.isArray(value) && value.length === 2) {
          // when there's grouped entries in one seriesItem (use 'Group By' field in editor)
          value = value[1];
        }
        if (!seriesName) {
          return value;
        }
        const unit = unitMap[seriesName] ?? '';
        const yAxisIndex = yAxisIndexMap[seriesName];
        const formatter = labelFormatters[yAxisIndex] ?? labelFormatters.default;
        return `
        <tr>
          <td>${marker}</td>
          <th style="text-align: right; padding: 0 1em;">${seriesName}</th>
          <td style="text-align: left; padding: 0 2px 0 1em;">
            ${formatter({ value })}
          </td>
          <th style="text-align: left; padding: 0;">
            ${unit ?? ''}
          </th>
        </tr>
        `;
      });

      const additionalMetrics = conf.tooltip.metrics.map((m) => {
        const metricData = extractData(data, m.data_key);
        const metricValues = _.uniq(
          arr.map(({ dataIndex }) => {
            return metricData[dataIndex];
          }),
        );
        const unit = metricUnitMap[m.name] ?? '';
        return `
        <tr>
          <td />
          <th style="text-align: right; padding: 0 1em;">${m.name}</th>
          ${metricValues.map((v) => {
            return `<td style="text-align: left; padding: 0 2px 0 1em;" >${formatAdditionalMetric(v)}</td>`;
          })}
          <th style="text-align: left; padding: 0;">
            ${unit ?? ''}
          </th>
        </tr>`;
      });
      lines.push(...additionalMetrics);

      const xAxisLabelStyle = getLabelOverflowStyleInTooltip(conf.x_axis.axisLabel.overflow.in_tooltip);
      const xAxisLabel = getXAxisLabel(arr, xAxisLabels);
      return `
      <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
        <div style="${xAxisLabelStyle}">${xAxisLabel}</div>
      </div>
      <table style="width: auto">
        <tbody>
          ${lines.join('')}
        </tbody>
      </table>
      `;
    },
  });
}
