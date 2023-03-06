import { TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';

export interface IRadarChartDimension {
  id: string;
  name: string;
  data_key: string;
  max: number;
  formatter: TNumbroFormat;
}

export interface IRadarChartConf {
  series_name_key: string;
  background: {
    enabled: boolean;
  };
  label: {
    enabled: boolean;
  };
  dimensions: IRadarChartDimension[];
}

export const DEFAULT_CONFIG: IRadarChartConf = {
  series_name_key: 'name',
  background: {
    enabled: true,
  },
  label: {
    enabled: true,
  },
  dimensions: [],
};
