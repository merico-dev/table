import { defaultNumbroFormat, TNumbroFormat } from '../../../panel/settings/common/numbro-format-selector';
import { ITemplateVariable } from '../../../utils/template/types';

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
  type: 'ecStat:regression';
  config: {
    method: 'linear' | 'exponential' | 'logarithmic' | 'polynomial';
    order: number;
    formulaOn: 'end';
  };
}

export interface IRegressionLineConf {
  type: 'line';
  yAxisIndex: number;
  color: string;
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
  stats: {
    templates: {
      top: string;
      bottom: string;
    };
    variables: ITemplateVariable[];
  };
}

export const DEFAULT_CONFIG: ICartesianChartConf = {
  regressions: [],
  series: [],
  stats: { templates: { bottom: '', top: '' }, variables: [] },
  x_axis_data_key: '',
  x_axis_name: '',
  y_axes: [
    {
      name: 'Y Axis',
      label_formatter: defaultNumbroFormat,
    },
  ],
};
