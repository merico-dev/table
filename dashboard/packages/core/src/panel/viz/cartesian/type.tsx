export interface ICartesianChartSeriesItem {
  type: 'line' | 'bar';
  name: string;
  showSymbol: false;
  y_axis_data_key: string;
  yAxisIndex: number;
  label_position?: string;
  stack: string;
  color?: string;
}

export interface IYAxisConf {
  name: string;
  label_formatter: string;
}

export interface ICartesianChartConf {
  x_axis_data_key: string;
  x_axis_name: string;
  y_axes: IYAxisConf[];
  series: ICartesianChartSeriesItem[];
}

export interface IVizCartesianChartPanel {
  conf: ICartesianChartConf;
  setConf: (values: ICartesianChartConf) => void;
}