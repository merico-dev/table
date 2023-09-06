import { getLabelOverflowOptionOnAxis } from '../../../common-echarts-fields/axis-label-overflow';
import { FormatterFuncType } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IHeatmapConf } from '../type';

export function getYAxis(conf: IHeatmapConf, yData: any[], formatterFunc: FormatterFuncType) {
  const { nameAlignment, data_key, ...rest } = conf.y_axis;

  const { overflow, rotate } = conf.y_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return {
    ...rest,
    type: 'category',
    data: yData,
    axisLabel: {
      rotate,
      ...overflowOption,
      formatter: formatterFunc,
    },
    axisLine: {
      show: true,
      color: 'blue',
    },
    axisTick: {
      show: true,
      alignWithLabel: true,
    },
    splitArea: {
      show: true,
    },
    nameTextStyle: {
      fontWeight: 'bold',
      align: nameAlignment,
    },
    nameLocation: 'end',
    nameGap: 15,
    z: 2,
  };
}
