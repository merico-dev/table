import { getLabelOverflowOptionOnAxis } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { IFunnelConf } from '../type';

export function getSeries(conf: IFunnelConf, data: AnyObject[]) {
  return conf.series.map((s) => {
    const { level_name_data_key, level_value_data_key, axisLabel, ...echartsProps } = s;

    const seriesData = data.map((d) => ({
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
