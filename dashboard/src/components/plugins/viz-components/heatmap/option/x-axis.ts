import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { getLabelOverflowOptionOnAxis } from '../../../common-echarts-fields/axis-label-overflow';
import { IHeatmapConf } from '../type';
import { FormatterFuncType } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';

export function getXAxis(conf: IHeatmapConf, xData: any[], formatterFunc: FormatterFuncType, borderWidth: number) {
  const { overflow, rotate } = conf.x_axis.axisLabel;
  const overflowOption = getLabelOverflowOptionOnAxis(overflow.on_axis);
  return defaultEchartsOptions.getXAxis({
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
    nameLocation: 'center',
    nameGap: 25,
    nameTextStyle: {
      fontWeight: 'bold',
      align: 'center',
    },
    z: 3,
  });
}
