export interface IEchartsOverflow {
  width: number;
  overflow: 'truncate' | 'break' | 'breakAll';
  ellipsis: '...';
}

export interface IAxisLabelOverflow {
  on_axis: IEchartsOverflow;
  in_tooltip: IEchartsOverflow;
}

export const DEFAULT_AXIS_LABEL_OVERFLOW: IAxisLabelOverflow = {
  on_axis: {
    width: 80,
    overflow: 'truncate',
    ellipsis: '...',
  },
  in_tooltip: {
    width: 200,
    overflow: 'break',
    ellipsis: '...',
  },
};
