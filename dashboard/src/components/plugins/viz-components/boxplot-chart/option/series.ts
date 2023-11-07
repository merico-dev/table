import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { IBoxplotChartConf, IBoxplotDataItem } from '../type';
import { BOXPLOT_DATA_ITEM_KEYS } from './common';
import { getDots, getLines, getViolin } from './series.custom';

const getRenderItem =
  (boxplotDataset: { source: IBoxplotDataItem[] }) =>
  (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => {
    return {
      type: 'group',
      children: [
        getViolin({ boxplotDataset, params, api }),
        getLines({ boxplotDataset, params, api }),
        getDots({ boxplotDataset, params, api }),
      ],
    };
  };

export function getSeries(conf: IBoxplotChartConf, dataset: any[]) {
  const { color } = conf;
  return [
    // {
    //   name: 'Placeholder Box',
    //   type: 'boxplot',
    //   ignore: true,
    //   silent: true,
    //   itemStyle: {
    //     color: 'none',
    //     borderColor: 'none',
    //     opacity: 0,
    //   },
    //   boxWidth: [10, 40],
    //   datasetIndex: 0,
    //   encode: {
    //     y: BOXPLOT_DATA_ITEM_KEYS,
    //     x: 'name',
    //     itemName: ['name'],
    //     tooltip: BOXPLOT_DATA_ITEM_KEYS,
    //   },
    // },
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
    {
      name: 'Scatter',
      type: 'custom',
      renderItem: getRenderItem(dataset[0]),
      symbolSize: 3,
      itemStyle: {
        color: '#ED6A45',
      },
      emphasis: {
        scale: 2,
      },
      xAxisIndex: 0,
      datasetIndex: 0,
    },
  ];
}
