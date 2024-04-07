import { AnyObject } from '~/types';
import { IEChartsLineType } from '../line-type';

export interface IRegressionTransform {
  type: 'ecStat:regression';
  config: {
    method: 'linear' | 'exponential' | 'logistic' | 'polynomial';
    order: number;
    formulaOn: 'end';
  };
}

export interface IRegressionLineConf {
  type: 'line';
  yAxisIndex: number;
  color: string;
  lineStyle: {
    type: IEChartsLineType;
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
