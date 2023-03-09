import { CallbackDataParams } from 'echarts/types/dist/shared';
import { getLabelOverflowStyleInTooltip } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { getEchartsXAxisLabel } from '../panel/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { ICartesianChartConf } from '../type';
import { IEchartsSeriesItem } from './utils/types';

function getXAxisLabel(params: AnyObject[], conf: ICartesianChartConf) {
  const basis = params.find((p) => p.axisDim === 'x' && p.axisId === 'main-x-axis');
  if (!basis) {
    return '';
  }
  const { name, axisType, axisValue, axisIndex } = basis;
  if (axisType === 'xAxis.category') {
    return name;
  }
  return getEchartsXAxisLabel(conf.x_axis.axisLabel.formatter)(axisValue, axisIndex);
}

export function getTooltip(
  conf: ICartesianChartConf,
  series: IEchartsSeriesItem[],
  labelFormatters: Record<string, (p: $TSFixMe) => string>,
) {
  const yAxisIndexMap = series.reduce((ret, { yAxisIndex, name }) => {
    ret[name] = yAxisIndex;
    return ret;
  }, {} as Record<string, number>);

  return {
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
        const yAxisIndex = yAxisIndexMap[seriesName];
        const formatter = labelFormatters[yAxisIndex] ?? labelFormatters.default;
        return `
        <tr>
          <td>${marker}</td>
          <th style="text-align: right; padding: 0 1em;">${seriesName}</th>
          <td style="text-align: left; padding: 0 1em;">${formatter({ value })}</td>
        </tr>
        `;
      });

      const xAxisLabelStyle = getLabelOverflowStyleInTooltip(conf.x_axis.axisLabel.overflow.in_tooltip);
      const xAxisLabel = getXAxisLabel(arr, conf);
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
  };
}
