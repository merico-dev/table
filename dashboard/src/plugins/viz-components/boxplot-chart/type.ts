import { ITemplateVariable } from '~/utils/template';

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
  };
  color: string;
  variables: ITemplateVariable[];
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
  },
  color: '#228be6',
  variables: [],
  reference_lines: [],
};
