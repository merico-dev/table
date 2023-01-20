import { CallbackDataParams } from 'echarts/types/dist/shared';
import { AnyObject } from '~/types';
import { getEchartsXAxisLabel } from '../panel/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { getXAxisLabelStyleInTooltip } from '../panel/x-axis/x-axis-label-max-length/utils';
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
      const xAxisLabel = getXAxisLabel(arr, conf);
      const lines = arr.map(({ seriesName, value }) => {
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
            <th style="text-align: right; padding: 0 1em;">${seriesName}</th>
            <td style="text-align: left; padding: 0 1em;">${formatter({ value })}</td>
          </tr>
        `;
      });

      const xAxisLabelStyle = getXAxisLabelStyleInTooltip(conf.x_axis.axisLabel.max_length);
      return `
      <table>
        <caption style="text-align: left; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd; ${xAxisLabelStyle}">${xAxisLabel}</caption>
        <tbody>
          ${lines.join('')}
        </tbody>
      </table>
      `;
    },
  };
}
