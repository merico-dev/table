import _, { defaultsDeep } from 'lodash';
import numbro from 'numbro';
import { ICartesianChartConf, IYAxisConf } from '../type';
import { getGrid } from './grid';
import { getRegressionConfs } from './regression';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getXAxes } from './x-axis';
import { getYAxes } from './y-axis';

const defaultOption = {
  legend: {
    show: true,
    bottom: 0,
    left: 0,
    type: 'scroll',
  },
  dataZoom: [
    {
      type: 'inside',
    },
  ],
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

export function getOption(conf: ICartesianChartConf, data: $TSFixMe[]) {
  const labelFormatters = conf.y_axes.reduce(
    (ret: Record<string, (params: $TSFixMe) => string>, { label_formatter }: IYAxisConf, index: number) => {
      ret[index] = function formatter(payload: $TSFixMe) {
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
      default: ({ value }: $TSFixMe) => value,
    },
  );

  const xAxisData = _.uniq(data.map((d) => d[conf.x_axis_data_key]));

  const series = getSeries(conf, xAxisData, data, labelFormatters);

  const { regressionDataSets, regressionSeries, regressionXAxes } = getRegressionConfs(conf, data);

  const customOptions = {
    xAxis: getXAxes(conf, xAxisData, regressionXAxes),
    yAxis: getYAxes(conf, labelFormatters),
    dataset: [...regressionDataSets],
    series: [...series, ...regressionSeries],
    tooltip: getTooltip(conf, labelFormatters),
    grid: getGrid(conf),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
