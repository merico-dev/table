import _ from 'lodash';
import { AnyObject } from '~/types';
import { FormatterFuncType } from '../../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { TMericoHeatmapConf } from '../../type';
import { getLabelOverflowOptionOnAxis } from '../../../../common-echarts-fields/axis-label-overflow';
import { parseDataKey } from '~/utils/data';

export function getYAxis(conf: TMericoHeatmapConf, data: TPanelData, formatterFunc: FormatterFuncType) {
  const x = parseDataKey(conf.x_axis.data_key);
  const y = parseDataKey(conf.y_axis.data_key);

  const { nameAlignment, data_key, ...rest } = conf.y_axis;
  const yData = _.uniq(data[x.queryID].map((d) => d[y.columnKey]));

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
    z: 1,
  };
}
