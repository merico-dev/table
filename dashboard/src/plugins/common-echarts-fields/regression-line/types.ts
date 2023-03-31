import { AnyObject } from '~/types';

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
  lineStyle: {
    type: 'solid' | 'dashed' | 'dotted';
    width: number;
  };
}

export interface IRegressionSeriesItem extends IRegressionLineConf {
  data: number[][];
  name: string;
  showSymbol: boolean;
  tooltip: Record<string, $TSFixMe>;
  smooth: boolean;
  custom?: AnyObject;
}

export type TDataForReg = number[][];
