import { IHeatmapConf } from '../type';

export function getSeries(conf: IHeatmapConf, seriesData: any[], borderWidth: number) {
  const { heat_block } = conf;

  return {
    type: 'heatmap',
    name: heat_block.name,
    xAxisId: 'main-x-axis',
    yAxisIndex: 0,
    datasetIndex: 0,
    itemStyle: {
      borderColor: 'white',
      borderWidth,
    },
    data: seriesData,
    label: heat_block.label,
    labelLayout: {
      hideOverlap: true,
    },
    z: 2,
  };
}
