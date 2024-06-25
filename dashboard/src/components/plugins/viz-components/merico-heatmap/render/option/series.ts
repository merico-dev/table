import { TMericoHeatmapConf } from '../../type';

export function getSeries(conf: TMericoHeatmapConf, seriesData: any[]) {
  const { heat_block } = conf;

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
    z: 2,
  };
}
