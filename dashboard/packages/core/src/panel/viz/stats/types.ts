import { TNumbroFormat } from "../../settings/common/numbro-format-selector";

export type ColorConf = {
  type: 'static';
  staticColor: string;
} | {
  type: 'continuous';
  valueRange: number[];
  colorRange: string[];
} | {
  type: 'piecewise'; // TODO
}

export interface IVizStatsVariable {
  name: string;
  data_field: string;
  formatter: TNumbroFormat;
  color: ColorConf;
  size: string;
  weight: string;
}

export interface IVizStatsConf {
  align: 'center',
  template: string;
  variables: IVizStatsVariable[]
}