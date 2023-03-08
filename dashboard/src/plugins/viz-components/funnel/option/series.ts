import _ from 'lodash';
import { getLabelOverflowOptionOnAxis } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { IFunnelConf, IFunnelSeriesItem } from '../type';

type SeriesDataType = {
  name: string;
  value: string | number;
};

function getMinValue(min: IFunnelSeriesItem['min']) {
  if (min.enable_value) {
    return min.value;
  }
  return undefined;
}

function getMaxValue(max: IFunnelSeriesItem['max']) {
  if (max.enable_value) {
    return max.value;
  }
  return undefined;
}

function getFunnelMargin(s: IFunnelSeriesItem) {
  const w = s.axisLabel.overflow.on_axis.width;
  const p = s.axisLabel.position;
  const ret = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
  if (s.orient === 'vertical') {
    if (_.get(ret, p) && p === s.funnelAlign) {
      _.set(ret, p, w);
    }
  }

  return ret;
}

export function getSeries(conf: IFunnelConf, data: AnyObject[]) {
  return conf.series.map((s) => {
    const { level_name_data_key, level_value_data_key, axisLabel, min, max, funnelAlign, orient, ...echartsProps } = s;

    const seriesData: SeriesDataType[] = data.map((d) => ({
      name: d[level_name_data_key],
      value: d[level_value_data_key],
    }));

    const labelOverflowOption = getLabelOverflowOptionOnAxis(axisLabel.overflow.on_axis);
    return {
      type: 'funnel',
      ...getFunnelMargin(s),
      min: getMinValue(min),
      max: getMaxValue(max),
      minSize: min.size,
      maxSize: max.size,
      ...echartsProps,
      label: {
        show: true,
        position: axisLabel.position,
        ...labelOverflowOption,
      },
      orient,
      funnelAlign: orient === 'horizontal' ? 'center' : funnelAlign,
      data: seriesData,
    };
  });
}
