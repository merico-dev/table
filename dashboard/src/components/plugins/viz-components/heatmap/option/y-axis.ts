import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { getLabelOverflowOptionOnAxis } from '../../../common-echarts-fields/axis-label-overflow';
import { FormatterFuncType } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IHeatmapConf } from '../type';

export function getYAxis(conf: IHeatmapConf, yData: any[], formatterFunc: FormatterFuncType, borderWidth: number) {
  const { nameAlignment, data_key, ...rest } = conf.y_axis;

  const { overflow, rotate } = conf.y_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return defaultEchartsOptions.getYAxis({
    ...rest,
    type: 'category',
    data: yData,
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
    nameLocation: 'end',
    nameGap: 15,
    z: 3,
  });
}
