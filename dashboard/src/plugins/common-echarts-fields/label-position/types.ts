export type IEchartsLabelPosition =
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
  | 'insideBottomRight'
  | 'outside';

export type LabelPositionOptionType = {
  label: string;
  value: IEchartsLabelPosition;
  disabled?: boolean;
};
