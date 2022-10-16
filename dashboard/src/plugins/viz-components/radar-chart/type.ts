import { TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';

export interface IRadarChartDimension {
  name: string;
  data_key: string;
  max: number;
  formatter: TNumbroFormat;
}

export interface IRadarChartConf {
  series_name_key: string;
  dimensions: IRadarChartDimension[];
}

export const DEFAULT_CONFIG: IRadarChartConf = {
  series_name_key: 'name',
  dimensions: [],
};
