export interface ICartesianChartSeriesItem {
  type: 'line' | 'bar';
  name: string;
  showSymbol: false;
  y_axis_data_key: string;
  y_axis_data_formatter?: string;
  label_position?: string;
  stack: string;
  color?: string;
}

export interface ICartesianChartConf {
  x_axis_data_key: string;
  x_axis_name: string;
  y_axis_name: string;
  series: ICartesianChartSeriesItem[];
}

export interface IVizCartesianChartPanel {
  conf: ICartesianChartConf;
  setConf: (values: ICartesianChartConf) => void;
}