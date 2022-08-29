import { IVizPanelProps } from '../../../types';

export interface IRadarChartDimension {
  name: string;
  data_key: string;
  max: number;
  color?: string;
}

export interface IRadarChartConf {
  series_name_key: string;
  dimensions: IRadarChartDimension[];
}

export interface IVizRadarChartPanel extends Omit<IVizPanelProps, 'conf' | 'setConf'> {
  conf: IRadarChartConf;
  setConf: (values: IRadarChartConf) => void;
}
