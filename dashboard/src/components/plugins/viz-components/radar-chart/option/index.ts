import _ from 'lodash';
import { IRadarChartConf } from '../type';
import { getSeries } from './series';
import { getTooltipFormatter } from './tooltip';

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

const palette = [
  '#66B4DB',
  '#39BFA2',
  '#E46464',
  '#33A678',
  '#EEBA00',
  '#9D88CB',
  '#939943',
  '#E49792',
  '#09A2B8',
  '#AF5F6B',
  '#6CA157',
  '#09A2B8',
  '#6398C7',
  '#E692BA',
  '#97B566',
  '#8CACE2',
  '#CA79AC',
  '#6DBC80',
  '#B08F4B',
  '#826BAF',
];

export function getOption(conf: IRadarChartConf, data: TPanelData) {
  const { series_name_key, dimensions, additional_series } = conf;
  if (!series_name_key || dimensions.length === 0) {
    return {};
  }

  const indicator = dimensions.map(({ name, max }) => ({
    name,
    max,
  }));

  const customOptions = {
    radar: {
      indicator,
      splitArea: {
        show: false,
      },
    },
    tooltip: {
      confine: true,
      backgroundColor: 'rgba(255,255,255,0.6)',
      formatter: getTooltipFormatter(conf),
    },
    legend: {
      show: true,
      bottom: 0,
      left: 'center',
      type: 'scroll',
    },
    series: getSeries(data, conf),
    color: palette,
  };

  return _.merge({}, defaultOption, customOptions);
}
