import _ from 'lodash';
import { ICartesianChartConf, IYAxisConf } from '../type';

type SeriesDataOut = number[];
type SeriesDataIn = [string | number, number][] | SeriesDataOut;
type PartialSeriesConfType = {
  yAxisIndex: number;
  data: SeriesDataIn;
};

function getNumbersFromData(seriesData: SeriesDataIn): SeriesDataOut {
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
    if (min === 0 && max === 0) {
      ret[index] = 1;
    }
  });
  return ret;
}

export function getYAxes(
  conf: ICartesianChartConf,
  labelFormatters: Record<string, (p: $TSFixMe) => string>,
  series: PartialSeriesConfType[],
) {
  const intervals = getReduceIntervalNeeds(series);
  return conf.y_axes.map(({ nameAlignment, min, max, show, ...rest }: IYAxisConf, index: number) => {
    let position = rest.position;
    if (!position) {
      position = index > 0 ? 'right' : 'left';
    }
    return {
      ...rest,
      minInterval: intervals[index] ?? 0,
      show,
      min: min ? min : undefined,
      max: max ? max : undefined,
      position,
      axisLabel: {
        show,
        formatter: labelFormatters[index] ?? labelFormatters.default,
      },
      axisLine: {
        show,
      },
      nameTextStyle: {
        fontWeight: 'bold',
        align: nameAlignment,
      },
      nameLocation: 'end',
      nameGap: show ? 15 : 0,
      splitLine: {
        show: false,
      },
    };
  });
}
