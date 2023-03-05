import _ from 'lodash';
import { AnyObject } from '~/types';
import { IHeatmapConf } from '../type';

export function getSeries(conf: IHeatmapConf, data: AnyObject[]) {
  const { x_axis, y_axis, heat_block } = conf;
  return {
    type: 'heatmap',
    name: '',
    xAxisId: 'main-x-axis',
    yAxisIndex: 0,
    datasetIndex: 0,
    // itemStyle: {
    //   color: getSeriesColor(scatter.color, variableValueMap),
    // },
    data: data.map((d) => {
      return [_.get(d, x_axis.data_key), _.get(d, y_axis.data_key), _.get(d, heat_block.data_key)];
    }),
  };
}
