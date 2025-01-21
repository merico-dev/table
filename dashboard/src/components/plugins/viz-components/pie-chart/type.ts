import { getDefaultSeriesOrder, SeriesOrder } from '../../common-echarts-fields/series-order';

export type NameColorMapRow = {
  name: string;
  color: string;
};
export interface IPieChartConf {
  label_field: TDataKey;
  value_field: TDataKey;
  color_field: TDataKey;
  radius: [string, string];
  color: {
    map: NameColorMapRow[];
  };
  series_order: SeriesOrder;
}

export const DEFAULT_CONFIG: IPieChartConf = {
  label_field: '',
  value_field: '',
  color_field: '',
  radius: ['50%', '80%'],
  color: {
    map: [],
  },
  series_order: getDefaultSeriesOrder(),
};
