import { IBoxplotChartConf } from '../../type';
import { BOXPLOT_DATA_ITEM_KEYS } from '../common';
import { getCustomBoxplot } from './custom';

export function getSeries(conf: IBoxplotChartConf, dataset: any[]) {
  return [
    {
      name: 'Placeholder Box',
      type: 'boxplot',
      ignore: true,
      silent: true,
      itemStyle: {
        color: 'none',
        borderColor: 'none',
        opacity: 0,
      },
      boxWidth: [20, 80],
      datasetIndex: 0,
      encode: {
        y: BOXPLOT_DATA_ITEM_KEYS,
        x: 'name',
        itemName: ['name'],
        tooltip: BOXPLOT_DATA_ITEM_KEYS,
      },
    },
    {
      name: 'Placeholder Outlier',
      type: 'scatter',
      symbolSize: 7,
      itemStyle: {
        color: 'transparent',
      },
      ignore: true,
      silent: true,
      emphasis: {
        scale: 2,
      },
      datasetIndex: 1,
    },
    getCustomBoxplot(dataset[0], conf),
  ];
}
