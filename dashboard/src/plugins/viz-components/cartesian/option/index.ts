import _, { defaultsDeep } from 'lodash';
import numbro from 'numbro';
import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import { ICartesianChartConf, ICartesianChartSeriesItem, IYAxisConf } from '../type';
import { getRegressionConfs } from './regression';
import { getSeries } from './series';

const defaultOption = {
  legend: {
    show: true,
    bottom: 0,
    left: 0,
    type: 'scroll',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: [
    {
      type: 'category',
      nameGap: 25,
      nameLocation: 'center',
      nameTextStyle: {
        fontWeight: 'bold',
      },
    },
  ],
  grid: {
    top: 10,
    left: 30,
    right: 15,
    bottom: 25,
    containLabel: true,
  },
};

export function getOption(conf: ICartesianChartConf, data: any[]) {
  const labelFormatters = conf.y_axes.reduce(
    (ret: Record<string, (params: any) => string>, { label_formatter }: IYAxisConf, index: number) => {
      ret[index] = function formatter(payload: any) {
        let value = payload;
        if (typeof payload === 'object') {
          if (Array.isArray(payload.value) && payload.value.length === 2) {
            // when there's grouped entries in one seriesItem (use 'Group By' field in editor)
            value = payload.value[1];
          } else {
            value = payload.value;
          }
        }
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

  const xAxisData = _.uniq(data.map((d) => d[conf.x_axis_data_key]));

  const series = getSeries(conf, xAxisData, data, labelFormatters);

  const { regressionDataSets, regressionSeries, regressionXAxes } = getRegressionConfs(conf, data);

  const customOptions = {
    xAxis: [
      {
        data: xAxisData,
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
      nameTextStyle: {
        fontWeight: 'bold',
      },
      nameLocation: 'middle',
      nameGap: 40,
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
    },
    grid: {
      bottom: conf.x_axis_name ? 40 : 25,
    },
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
