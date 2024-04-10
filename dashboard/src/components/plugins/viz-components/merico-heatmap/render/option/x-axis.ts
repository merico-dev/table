import _ from 'lodash';

import { TMericoHeatmapConf } from '../../type';
import { getLabelOverflowOptionOnAxis } from '../../../../common-echarts-fields/axis-label-overflow';
import { parseDataKey } from '~/utils';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { FormatterFuncType } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';

export function getXAxis(conf: TMericoHeatmapConf, data: TPanelData, formatterFunc: FormatterFuncType) {
  const x = parseDataKey(conf.x_axis.data_key);
  const xData = _.uniq(data[x.queryID].map((d) => d[x.columnKey]));

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
      show: false,
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
