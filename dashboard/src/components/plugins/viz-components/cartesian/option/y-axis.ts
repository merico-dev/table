import _ from 'lodash';
import { ICartesianChartConf, IYAxisConf } from '../type';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { YAXisOption } from 'echarts/types/dist/shared';

type SeriesDataOut = number[];
type SeriesDataIn = [string | number, number][] | SeriesDataOut;
type PartialSeriesConfType = {
  yAxisIndex: number;
  data: SeriesDataIn;
};

function getNumbersFromData(seriesData: SeriesDataIn): SeriesDataOut {
  if (!seriesData) {
    return [];
  }
  try {
    if (Array.isArray(seriesData[0]) && seriesData[0]?.length >= 2) {
      const s = seriesData as [string | number, number][];
      return s.map((d) => Number(d[1]));
    }

    return [...seriesData] as SeriesDataOut;
  } catch (error) {
    console.error(error);
    return [...seriesData] as SeriesDataOut;
  }
}

function getReduceIntervalNeeds(series: PartialSeriesConfType[]) {
  if (series.length === 0) {
    return {};
  }

  const ret: Record<string, number> = {};
  const datas: Record<number, SeriesDataOut> = {};
  series.forEach((s) => {
    const data = getNumbersFromData(s.data);
    if (!datas[s.yAxisIndex]) {
      datas[s.yAxisIndex] = data;
      return;
    }
    datas[s.yAxisIndex] = datas[s.yAxisIndex].concat(data);
  });

  Object.entries(datas).forEach(([index, data]) => {
    const min = _.minBy(data) ?? 0;
    const max = _.maxBy(data) ?? 0;
    if (min == 0 && max == 0) {
      ret[index] = 1;
    }
  });
  return ret;
}

function getExtremeValue(value: string, min: string, max: string, mirror: boolean, factor: -1 | 1) {
  if (!mirror) {
    return value || undefined;
  }
  return (v: { min: number; max: number }) => {
    const _min = !!min && Number.isFinite(Number(min)) ? Math.abs(Number(min)) : Math.abs(v.min);
    const _max = !!max && Number.isFinite(Number(max)) ? Math.abs(Number(max)) : Math.abs(v.max);

    const extreme = Math.max(_min, _max, 0);
    return factor * extreme;
  };
}

export function getYAxes(
  conf: ICartesianChartConf,
  labelFormatters: Record<string, (p: $TSFixMe) => string>,
  series: PartialSeriesConfType[],
) {
  const intervals = getReduceIntervalNeeds(series);
  return conf.y_axes.map(({ nameAlignment, min, max, show, mirror, ...rest }: IYAxisConf, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'right' : 'left';
    }
    return defaultEchartsOptions.getYAxis({
      ...rest,
      minInterval: intervals[index] ?? 0,
      show,
      alignTicks: mirror,
      min: getExtremeValue(min, min, max, mirror, -1),
      max: getExtremeValue(max, min, max, mirror, 1),
      position,
      axisLabel: {
        show,
        formatter: labelFormatters[index] ?? labelFormatters.default,
      },
      nameTextStyle: {
        align: nameAlignment,
      },
      nameLocation: 'end',
      nameGap: show ? 15 : 0,
      splitLine: {
        show: index === 0,
      },
    });
  });
}
