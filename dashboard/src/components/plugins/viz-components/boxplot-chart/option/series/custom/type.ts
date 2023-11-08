import { AnyObject } from '~/types';
import { IBoxplotDataItem } from '../../../type';
import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';

export type BoxplotDataset = { source: IBoxplotDataItem[] };
export type BoxplotSeries = {
  name: string;
  type: 'custom';
  boxWidth: [number, number];
  itemStyle: {
    color: string;
    borderColor: string;
    borderWidth: number;
  };

  [key: string]: any;
};

export type Payload = {
  api: CustomSeriesRenderItemAPI;
  arr: [string, any][];
  source: IBoxplotDataItem;
  categoryIndex: number;
  outlierGroup: Record<string, number>;
};

export type RenderProps = {
  layout: AnyObject[];
  seriesConf: BoxplotSeries;
  payload: Payload;
};

export type Props = {
  boxplotDataset: { source: IBoxplotDataItem[] };
  api: CustomSeriesRenderItemAPI;
};
