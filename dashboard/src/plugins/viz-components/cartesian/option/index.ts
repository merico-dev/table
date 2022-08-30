import _ from 'lodash';
import numbro from 'numbro';
import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import { ICartesianChartConf, ICartesianChartSeriesItem, IYAxisConf } from '../type';
import { getRegressionConfs } from './regression';

const defaultOption = {
  legend: {
    show: true,
    bottom: 0,
    left: 0,
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    nameGap: 25,
    nameLocation: 'center',
    nameTextStyle: {
      fontWeight: 'bold',
    },
  },
  grid: {
    top: 0,
    left: 15,
    right: 15,
    bottom: 30,
    containLabel: true,
  },
};

export function getOption(conf: ICartesianChartConf, data: any[]) {
  const labelFormatters = conf.y_axes.reduce(
    (ret: Record<string, (params: any) => string>, { label_formatter }: IYAxisConf, index: number) => {
      ret[index] = function formatter(payload: any) {
        const value = typeof payload === 'object' ? payload.value : payload;
        if (!label_formatter) {
          return value;
        }
        try {
          return numbro(value).format(label_formatter);
        } catch (error) {
          console.error(error);
          return value;
        }
      };
      return ret;
    },
    {
      default: ({ value }: any) => value,
    },
  );

  const yAxisIndexMap = conf.series.reduce(
    (ret: Record<string, number>, { yAxisIndex, name }: ICartesianChartSeriesItem) => {
      ret[name] = yAxisIndex;
      return ret;
    },
    {},
  );

  const series = conf.series.map(
    ({ y_axis_data_key, yAxisIndex, label_position, name, ...rest }: ICartesianChartSeriesItem) => {
      const ret: any = {
        data: data.map((d) => d[y_axis_data_key]),
        label: {
          show: !!label_position,
          position: label_position,
          formatter: labelFormatters[yAxisIndex ?? 'default'],
        },
        name,
        xAxisId: 'main-x-axis',
        yAxisIndex,
        ...rest,
      };
      return ret;
    },
  );

  const { regressionDataSets, regressionSeries, regressionXAxes } = getRegressionConfs(conf, data);

  const customOptions = {
    xAxis: [
      {
        data: data.map((d) => d[conf.x_axis_data_key]),
        name: conf.x_axis_name ?? '',
        id: 'main-x-axis',
      },
      ...regressionXAxes,
    ],
    yAxis: conf.y_axes.map(({ label_formatter, ...rest }: IYAxisConf, index: number) => ({
      ...rest,
      axisLabel: {
        show: true,
        formatter: labelFormatters[index] ?? labelFormatters.default,
      },
    })),
    dataset: [...regressionDataSets],
    series: [...series, ...regressionSeries],
    tooltip: {
      formatter: function (params: TopLevelFormatterParams) {
        const arr = Array.isArray(params) ? params : [params];
        if (arr.length === 0) {
          return '';
        }
        const lines = arr.map(({ seriesName, value }) => {
          if (!seriesName) {
            return value;
          }
          const yAxisIndex = yAxisIndexMap[seriesName];
          const formatter = labelFormatters[yAxisIndex] ?? labelFormatters.default;
          return `${seriesName}: ${formatter({ value })}`;
        });
        lines.unshift(`<strong>${arr[0].name}</strong>`);
        return lines.join('<br />');
      },
    },
  };
  return _.merge({}, defaultOption, customOptions);
}
