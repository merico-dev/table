import { getDefaultSeriesOrder, SeriesOrder } from '../../common-echarts-fields/series-order';
import { getDefaultSeriesUnit, SeriesUnitType } from '../../common-echarts-fields/series-unit';
import { NameColorMapRow } from '../../editor-components/name-color-map-editor';

export type PieChartOthersSector = {
  label: string | null;
  threshold: number | null;
};

export const getDefaultOthersSector = () => ({
  label: null,
  threshold: null,
});

export type { NameColorMapRow };
export interface IPieChartConf {
  label_field: TDataKey;
  value_field: TDataKey;
  color_field: TDataKey;
  radius: [string, string];
  color: {
    map: NameColorMapRow[];
  };
  unit: SeriesUnitType;
  series_order: SeriesOrder;
  others_sector: PieChartOthersSector;
}

export const DEFAULT_CONFIG: IPieChartConf = {
  label_field: '',
  value_field: '',
  color_field: '',
  radius: ['50%', '80%'],
  color: {
    map: [],
  },
  unit: getDefaultSeriesUnit(),
  series_order: getDefaultSeriesOrder(),
  others_sector: getDefaultOthersSector(),
};
