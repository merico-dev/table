import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import { AnyObject } from '~/types';
import { getEchartsXAxisLabel } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IScatterChartConf } from '../type';

function getXAxisLabel(params: AnyObject[], conf: IScatterChartConf) {
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

export function getTooltip(conf: IScatterChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  return {
    formatter: function (params: TopLevelFormatterParams) {
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
        const yAxisIndex = 0;
        const formatter = labelFormatters[yAxisIndex] ?? labelFormatters.default;
        return `${seriesName}: <strong>${formatter({ value })}</strong>`;
      });
      lines.unshift(`<strong>${xAxisLabel}</strong>`);
      return lines.join('<br />');
    },
  };
}
