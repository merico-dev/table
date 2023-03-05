import _ from 'lodash';
import { AnyObject } from '~/types';
import { getEchartsXAxisLabel } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IHeatmapConf } from '../type';

export function getYAxis(conf: IHeatmapConf, data: AnyObject[]) {
  const { nameAlignment, data_key, axisLabel, ...rest } = conf.y_axis;
  return {
    ...rest,
    type: 'category',
    data: _.uniq(data.map((d) => d[data_key])),
    axisLabel: {
      ...axisLabel,
      formatter: getEchartsXAxisLabel(axisLabel.formatter),
    },
    axisLine: {
      show: true,
      color: 'blue',
    },
    axisTick: {
      show: true,
      alignWithLabel: true,
    },
    nameTextStyle: {
      fontWeight: 'bold',
      align: nameAlignment,
    },
    nameLocation: 'end',
    nameGap: 15,
  };
}
