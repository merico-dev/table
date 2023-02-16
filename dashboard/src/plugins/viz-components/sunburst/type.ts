export type TEchartsLabelPosition =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'inside'
  | 'insideLeft'
  | 'insideRight'
  | 'insideTop'
  | 'insideBottom'
  | 'insideTopLeft'
  | 'insideBottomLeft'
  | 'insideTopRight'
  | 'insideBottomRight';

export interface ISunburstLevelConf {
  id: string;
  r0: string;
  r: string;
  label: {
    show_label_tolerance: number;
    rotate: 'radial' | 'tangential' | '0';
    align: 'left' | 'center' | 'right';
    position: TEchartsLabelPosition;
    padding: number;
  };
}

export interface ISunburstConf {
  label_key: string;
  value_key: string;
  group_key: string;
  levels: ISunburstLevelConf[];
}

export const DEFAULT_CONFIG: ISunburstConf = {
  label_key: '',
  value_key: '',
  group_key: '',
  levels: [],
};

export type SunburstItemType = {
  name: string;
  value?: string | number | null;
} & Record<string, any>;
