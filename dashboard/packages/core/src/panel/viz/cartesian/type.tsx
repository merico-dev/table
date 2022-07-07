import { IVizPanelProps } from "../../../types";
import { TNumbroFormat } from "../../settings/common/numbro-format-selector";

export interface ICartesianChartSeriesItem {
  type: 'line' | 'bar';
  name: string;
  showSymbol: false;
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

export interface ICartesianChartConf {
  x_axis_data_key: string;
  x_axis_name: string;
  y_axes: IYAxisConf[];
  series: ICartesianChartSeriesItem[];
}

export interface IVizCartesianChartPanel extends Omit<IVizPanelProps, 'conf' | 'setConf'> {
  conf: ICartesianChartConf;
  setConf: (values: ICartesianChartConf) => void;
}