import { TNumbroFormat } from "../../settings/common/numbro-format-selector";

export type ColorConf = {
  type: 'static';
  staticColor: string;
} | {
  type: 'continuous';
  valueRange: number[];
  colorRange: string[];
  valueField: string;
} | {
  type: 'piecewise'; // TODO
}

export interface IVizStatsContent {
  prefix: string;
  data_field: string;
  formatter: TNumbroFormat;
  postfix: string;
}

export interface IVizStatsConf {
  align: 'center',
  color: ColorConf;
  size: string;
  weight: string;
  content: IVizStatsContent;
}