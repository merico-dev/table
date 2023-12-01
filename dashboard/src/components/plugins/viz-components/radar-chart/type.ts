import { TNumberFormat } from '~/utils';

export type TAdditionalSeriesItem = {
  id: string;
  name_key: TDataKey;
  color_key: TDataKey;
};
export interface IRadarChartDimension {
  id: string;
  name: string;
  data_key: TDataKey;
  max: string;
  formatter: TNumberFormat;
}

export interface IRadarChartConf {
  series_name_key: TDataKey;
  additional_series: TAdditionalSeriesItem[];
  background: {
    enabled: boolean;
  };
  label: {
    enabled: boolean;
  };
  dimensions: IRadarChartDimension[];
}

export const DEFAULT_CONFIG: IRadarChartConf = {
  series_name_key: '',
  additional_series: [],
  background: {
    enabled: true,
  },
  label: {
    enabled: true,
  },
  dimensions: [],
};
