import _ from 'lodash';
import { IRadarChartConf } from '../type';

const defaultOption = {
  legend: {
    show: true,
    bottom: 0,
    left: 0,
  },
  tooltip: {
    trigger: 'item',
  },
};

export function getOption(conf: IRadarChartConf, data: $TSFixMe[]) {
  const indicator = conf.dimensions.map(({ name, max, color }) => ({
    name,
    max,
    color,
  }));

  const seriesData = data.map((row) => ({
    value: conf.dimensions.map(({ data_key }) => row[data_key]),
    name: row[conf.series_name_key],
  }));

  const customOptions = {
    radar: {
      indicator,
    },
    series: {
      type: 'radar',
      data: seriesData,
    },
  };
  return _.merge({}, defaultOption, customOptions);
}
