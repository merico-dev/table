export type ColorConf = {
  type: 'static';
  value: string;
} | {
  type: 'continuous';
  valueRange: number[];
  colorRange: string[];
} | {
  type: 'piecewise'; // TODO
}

export interface IVizStatsConf {
  align: 'center',
  color: ColorConf;
  size: string;
  weight: string;
  template: string;
  value_field: string;
}