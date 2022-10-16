export interface IRadarChartDimension {
  name: string;
  data_key: string;
  max: number;
}

export interface IRadarChartConf {
  series_name_key: string;
  dimensions: IRadarChartDimension[];
}

export const DEFAULT_CONFIG: IRadarChartConf = {
  series_name_key: 'name',
  dimensions: [],
};
