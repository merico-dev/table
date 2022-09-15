import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../type';

export function getTooltip(conf: ICartesianChartConf, labelFormatters: Record<string, (p: $TSFixMe) => string>) {
  const yAxisIndexMap = conf.series.reduce(
    (ret: Record<string, number>, { yAxisIndex, name }: ICartesianChartSeriesItem) => {
      ret[name] = yAxisIndex;
      return ret;
    },
    {},
  );
  return {
    formatter: function (params: TopLevelFormatterParams) {
      const arr = Array.isArray(params) ? params : [params];
      if (arr.length === 0) {
        return '';
      }
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
        return `${seriesName}: <strong>${formatter({ value })}</strong>`;
      });
      lines.unshift(`<strong>${arr[0].name}</strong>`);
      return lines.join('<br />');
    },
  };
}
