import { IBoxplotDataItem, TOutlierDataItem } from '../../../type';

export type BoxplotDataset = { source: IBoxplotDataItem[] };
export type OutlierDataset = { source: TOutlierDataItem[] };

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

export type ScatterSeries = {
  name: string;
  type: 'custom';
  boxWidth: [number, number];
  itemStyle: {
    color: string;
  };

  [key: string]: any;
};
