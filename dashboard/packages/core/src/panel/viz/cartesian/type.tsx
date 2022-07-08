import { IVizPanelProps } from "../../../types";
import { TNumbroFormat } from "../../settings/common/numbro-format-selector";

// TODO: https://github.com/merico-dev/table/issues/86
export interface ICartesianChartSeriesItem {
  type: 'line' | 'bar' | 'scatter';
  name: string;
  showSymbol: false;
  symbolSize: number;
  y_axis_data_key: string;
  yAxisIndex: number;
  label_position?: string;
  stack: string;
  color?: string;
  barWidth: string;
  smooth: boolean;
  step: false | 'start' | 'middle' | 'end';
}

export interface IYAxisConf {
  name: string;
  label_formatter: TNumbroFormat;
}

export interface IRegressionTransform {
  type: 'ecStat:regression',
  config: {
    method: 'linear' | 'exponential' | 'logarithmic' | 'polynomial';
    order: number;
    formulaOn: 'end';
  }
}

export interface IRegressionLineConf {
  type: 'line';
  yAxisIndex: number;
}

export interface IRegressionConf {
  transform: IRegressionTransform;
  plot: IRegressionLineConf;
  name: string;
  y_axis_data_key: string;
}

export interface ICartesianChartConf {
  x_axis_data_key: string;
  x_axis_name: string;
  y_axes: IYAxisConf[];
  series: ICartesianChartSeriesItem[];
  regressions: IRegressionConf[];
}

export interface IVizCartesianChartPanel extends Omit<IVizPanelProps, 'conf' | 'setConf'> {
  conf: ICartesianChartConf;
  setConf: (values: ICartesianChartConf) => void;
}