import _ from 'lodash';
import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { IFunnelConf, IFunnelSeriesItem } from '../type';
import { parseDataKey } from '~/utils';

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

export function getSeries(conf: IFunnelConf, data: TPanelData) {
  return conf.series.map((s) => {
    const { level_name_data_key, level_value_data_key, axisLabel, min, max, funnelAlign, orient, ...echartsProps } = s;
    if (!level_name_data_key || !level_value_data_key) {
      return {};
    }

    const n = parseDataKey(level_name_data_key);
    const v = parseDataKey(level_value_data_key);
    const seriesData: SeriesDataType[] = data[n.queryID].map((d) => ({
      name: d[n.columnKey],
      value: d[v.columnKey],
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
