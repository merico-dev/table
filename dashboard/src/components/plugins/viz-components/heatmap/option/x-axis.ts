import { getLabelOverflowOptionOnAxis } from '../../../common-echarts-fields/axis-label-overflow';
import { FormatterFuncType } from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IHeatmapConf } from '../type';

export function getXAxis(conf: IHeatmapConf, xData: any[], formatterFunc: FormatterFuncType) {
  const { overflow, rotate } = conf.x_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return {
    id: 'main-x-axis',
    type: 'category',
    data: xData,
    name: conf.x_axis.name ?? '',
    align: 'center',
    axisTick: {
      show: true,
      alignWithLabel: true,
    },
    axisLabel: {
      rotate,
      ...overflowOption,
      formatter: formatterFunc,
    },
    splitArea: {
      show: true,
    },
    nameLocation: 'center',
    nameGap: 25,
    nameTextStyle: {
      fontWeight: 'bold',
      align: 'center',
    },
    z: 2,
  };
}
