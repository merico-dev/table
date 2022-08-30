export interface IBoxplotChartConf {
  x_axis: {
    name: string;
    data_key: string;
  };
  y_axis: {
    name: string;
    data_key: string;
  };
}

export const DEFAULT_CONFIG: IBoxplotChartConf = {
  x_axis: {
    name: 'X Axis',
    data_key: '',
  },
  y_axis: {
    name: 'Y Axis',
    data_key: 'value',
  },
};
