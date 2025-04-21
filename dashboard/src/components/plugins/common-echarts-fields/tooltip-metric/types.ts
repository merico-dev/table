import { SeriesUnitType } from '../series-unit';

export interface IEchartsTooltipMetric {
  id: string;
  data_key: TDataKey;
  name: string;
  unit: SeriesUnitType;
}
