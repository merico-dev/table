import { getLabelOverflowOptionOnAxis } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { IFunnelConf, IFunnelSeriesItem } from '../type';

type SeriesDataType = {
  name: string;
  value: string | number;
};

function getMinValue(min: IFunnelSeriesItem['min']) {
  if (min.use_data_min) {
    return undefined;
  }
  return min.value;
}

function getMaxValue(max: IFunnelSeriesItem['max']) {
  if (max.use_data_max) {
    return undefined;
  }
  return max.value;
}

export function getSeries(conf: IFunnelConf, data: AnyObject[]) {
  return conf.series.map((s) => {
    const { level_name_data_key, level_value_data_key, axisLabel, min, max, ...echartsProps } = s;

    const seriesData: SeriesDataType[] = data.map((d) => ({
      name: d[level_name_data_key],
      value: d[level_value_data_key],
    }));

    const labelOverflowOption = getLabelOverflowOptionOnAxis(axisLabel.overflow.on_axis);
    return {
      type: 'funnel',
      top: 5,
      left: 5,
      right: 5,
      bottom: 5,
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
      data: seriesData,
    };
  });
}
