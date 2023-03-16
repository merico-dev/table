import _ from 'lodash';
import { IRadarChartConf } from '../type';
import { getFormatter } from './formatter';
import { getSeriesLabel } from './series.label';
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

export function getOption(conf: IRadarChartConf, data: TVizData) {
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

  const indicator = conf.dimensions.map(({ name, max }) => ({
    name,
    max,
  }));

  const seriesData = data.map((row) => ({
    value: conf.dimensions.map(({ data_key }) => row[data_key]),
    name: row[conf.series_name_key],
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
    series: {
      type: 'radar',
      data: seriesData,
      symbolSize: 4,
      lineStyle: {
        width: 1,
      },
      emphasis: {
        lineStyle: {
          width: 4,
        },
      },
      areaStyle: conf.background.enabled
        ? {
            opacity: 0.4,
          }
        : undefined,
      label: getSeriesLabel(conf),
    },
    color: palette,
  };

  return _.merge({}, defaultOption, customOptions);
}
