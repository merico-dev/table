import { TNumberOrDynamic } from '../number-or-dynamic-value';
import { ChartingOrientation } from '../orientation';

export type VisualMapType = 'continuous' | 'piecewise';
export type VisualMapHorizontalAlign = 'left' | 'center' | 'right' | number;
export type VisualMapVerticalAlign = 'top' | 'center' | 'bottom' | number;
export type VisualMapSkipRange = {
  min: string | '';
  lt_min: string | '';
  max: string | '';
  gt_max: string | '';
};

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
    color: string[];
  };
  skipRange: VisualMapSkipRange;
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
    color: string[];
  };
  // outRange: {} not supported for now
};

export type VisualMap = ContinuousVisualMap | PiecewiseVisualMap;

export type ContinuousVisualMapOption = {
  type: 'continuous';
  id: string;
  min: number;
  max: number;
  orient: ChartingOrientation;
  left: VisualMapHorizontalAlign;
  top: VisualMapVerticalAlign;
  text: [string, string];
  calculable: boolean;
  itemWidth: number;
  itemHeight: number;
  show: boolean;
  inRange: {
    color: string[];
  };
};

export type PiecewiseVisualMapOption = {
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
    color: string[];
  };
  // outRange: {} not supported for now
};
export type VisualMapOption = ContinuousVisualMapOption | PiecewiseVisualMapOption;
