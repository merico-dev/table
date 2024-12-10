import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { getLabelOverflowOptionOnAxis } from '../../../common-echarts-fields/axis-label-overflow';
import { IHeatmapConf } from '../type';
import { FormatterFuncType } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';
import _ from 'lodash';

export function getYAxis(conf: IHeatmapConf, formatterFunc: FormatterFuncType, borderWidth: number) {
  const { nameAlignment, data_key, inverse, ...rest } = conf.y_axis;

  const { overflow, rotate } = conf.y_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return defaultEchartsOptions.getYAxis({
    ...rest,
    type: 'category',
    axisLabel: {
      rotate,
      ...overflowOption,
      formatter: formatterFunc,
    },
    axisTick: {
      show: true,
      alignWithLabel: true,
    },
    axisLine: {
      show: true,
      lineStyle: {
        width: 3,
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: '#E7E7E9',
      },
    },
    splitLine: {
      show: borderWidth > 0,
      interval: 0,
      lineStyle: {
        type: 'solid',
        color: 'white',
      },
    },
    nameTextStyle: {
      fontWeight: 'bold',
      align: nameAlignment,
    },
    nameLocation: inverse ? 'start' : 'end',
    nameGap: 15,
    inverse,
    z: 3,
  });
}
