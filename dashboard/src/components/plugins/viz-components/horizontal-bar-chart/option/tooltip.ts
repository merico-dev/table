import { CallbackDataParams } from 'echarts/types/dist/shared';
import { getLabelOverflowStyleInTooltip } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { IHorizontalBarChartConf } from '../type';
import { IEchartsSeriesItem } from './utils/types';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { getEchartsXAxisLabel } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';

function getYAxisLabel(params: AnyObject[], conf: IHorizontalBarChartConf) {
  const basis = params.find((p) => p.axisDim === 'y' && p.axisId === 'main-y-axis');
  if (!basis) {
    return '';
  }
  const { name, axisType, axisValue, axisIndex } = basis;
  if (axisType === 'yAxis.category') {
    return name;
  }
  return getEchartsXAxisLabel(conf.y_axis.axisLabel.formatter)(axisValue, axisIndex);
}

export function getTooltip(
  conf: IHorizontalBarChartConf,
  series: IEchartsSeriesItem[],
  labelFormatters: Record<string, (p: $TSFixMe) => string>,
) {
  const xAxisIndexMap = series.reduce((ret, { xAxisIndex, name }) => {
    ret[name] = xAxisIndex;
    return ret;
  }, {} as Record<string, number>);

  return defaultEchartsOptions.getTooltip({
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: function (params: CallbackDataParams[]) {
      const arr = Array.isArray(params) ? params : [params];
      if (arr.length === 0) {
        return '';
      }
      const lines = arr.map(({ seriesName, marker, value }) => {
        if (Array.isArray(value) && value.length === 2) {
          // when there's grouped entries in one seriesItem (use 'Group By' field in editor)
          value = value[0];
        }
        if (!seriesName) {
          return value;
        }
        const xAxisIndex = xAxisIndexMap[seriesName];
        const formatter = labelFormatters[xAxisIndex] ?? labelFormatters.default;
        return `
        <tr>
          <td>${marker}</td>
          <th style="text-align: right; padding: 0 1em;">${seriesName}</th>
          <td style="text-align: left; padding: 0 1em;">${formatter({ value })}</td>
        </tr>
        `;
      });

      const yAxisLabelStyle = getLabelOverflowStyleInTooltip(conf.y_axis.axisLabel.overflow.in_tooltip);
      const yAxisLabel = getYAxisLabel(arr, conf);
      return `
      <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
        <div style="${yAxisLabelStyle}">${yAxisLabel}</div>
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
