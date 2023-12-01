import _ from 'lodash';
import { parseDataKey } from '~/utils';
import { TMericoHeatmapConf } from '../../type';

export function getSeries(conf: TMericoHeatmapConf, data: TPanelData) {
  const { x_axis, y_axis, heat_block } = conf;
  const x = parseDataKey(x_axis.data_key);
  const y = parseDataKey(y_axis.data_key);
  const h = parseDataKey(heat_block.data_key);

  const seriesData = data[x.queryID].map((d) => {
    return [_.get(d, x.columnKey), _.get(d, y.columnKey), _.get(d, h.columnKey)];
  });

  return {
    type: 'heatmap',
    name: heat_block.name,
    xAxisId: 'main-x-axis',
    yAxisIndex: 0,
    datasetIndex: 0,
    itemStyle: {
      borderWidth: 0,
    },
    data: seriesData,
    label: heat_block.label,
    labelLayout: {
      hideOverlap: true,
    },
  };
}
