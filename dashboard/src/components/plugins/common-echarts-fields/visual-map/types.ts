import { TNumberOrDynamic } from '../number-or-dynamic-value';
import { ChartingOrientation } from '../orientation';

export type VisualMapType = 'continuous' | 'piecewise';
export type VisualMapHorizontalAlign = 'left' | 'center' | 'right';
export type VisualMapVerticalAlign = 'top' | 'center' | 'bottom';
export type VisualMapInRangeColor = string[];

export type ContinuousVisualMap = {
  type: 'continuous';
  id: string;
  min: TNumberOrDynamic;
  max: TNumberOrDynamic;
  orient: ChartingOrientation;
  left: VisualMapHorizontalAlign;
  top: VisualMapVerticalAlign;
  text: [string, string];
  calculable: boolean;
  itemWidth: number;
  itemHeight: number;
  show: boolean;
  inRange: {
    color: VisualMapInRangeColor;
  };
  // outRange: {} not supported for now
};
export type PiecewiseVisualMap = {
  type: 'piecewise';
  id: string;
  min: TNumberOrDynamic;
  max: TNumberOrDynamic;
  orient: ChartingOrientation;
  left: VisualMapHorizontalAlign;
  top: VisualMapVerticalAlign;
  text: [string, string];
  calculable: boolean;
  itemWidth: number;
  itemHeight: number;
  show: boolean;
  inRange: {
    color: VisualMapInRangeColor;
  };
  // outRange: {} not supported for now
};

export type VisualMap = ContinuousVisualMap | PiecewiseVisualMap;
