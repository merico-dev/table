import { TNumbroFormat } from '~/components/panel/settings/common/numbro-format-selector';

export interface IRadarChartDimension {
  id: string;
  name: string;
  data_key: TDataKey;
  max: number;
  formatter: TNumbroFormat;
}

export interface IRadarChartConf {
  series_name_key: TDataKey;
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
  background: {
    enabled: true,
  },
  label: {
    enabled: true,
  },
  dimensions: [],
};