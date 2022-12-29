import { defaultNumbroFormat, TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';

export interface IBoxplotReferenceLine {
  name: string;
  template: string;
  variable_key: string;
}

export interface IBoxplotChartConf {
  x_axis: {
    name: string;
    data_key: string;
  };
  y_axis: {
    name: string;
    data_key: string;
    label_formatter: TNumbroFormat;
  };
  color: string;
  reference_lines: IBoxplotReferenceLine[];
}

export const DEFAULT_CONFIG: IBoxplotChartConf = {
  x_axis: {
    name: 'X Axis',
    data_key: '',
  },
  y_axis: {
    name: 'Y Axis',
    data_key: 'value',
    label_formatter: defaultNumbroFormat,
  },
  color: '#228be6',
  reference_lines: [],
};

export interface IBoxplotDataItem {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: Array<[string, number]>;
}
