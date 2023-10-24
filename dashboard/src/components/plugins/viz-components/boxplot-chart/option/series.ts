import { IBoxplotChartConf } from '../type';
import { BOXPLOT_DATA_ITEM_KEYS } from './common';

export function getSeries(conf: IBoxplotChartConf) {
  const { color } = conf;
  return [
    {
      name: 'Box',
      type: 'boxplot',
      itemStyle: {
        color,
        borderColor: '#2F8CC0',
        borderWidth: 2,
      },
      emphasis: {
        disabled: true,
      },
      boxWidth: [10, 40],
      datasetIndex: 0,
      encode: {
        y: BOXPLOT_DATA_ITEM_KEYS,
        x: 'name',
        itemName: ['name'],
        tooltip: BOXPLOT_DATA_ITEM_KEYS,
      },
    },
    {
      name: 'Outlier',
      type: 'scatter',
      symbolSize: 7,
      itemStyle: {
        color: '#ED6A45',
      },
      emphasis: {
        scale: 2,
      },
      datasetIndex: 1,
    },
  ];
}
