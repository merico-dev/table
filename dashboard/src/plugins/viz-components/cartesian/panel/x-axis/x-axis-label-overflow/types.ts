export interface IOverflow {
  width: number;
  overflow: 'truncate' | 'break' | 'breakAll';
  ellipsis: '...';
}

export interface IXAxisLabelOverflow {
  x_axis: IOverflow;
  tooltip: IOverflow;
}

export const DEFAULT_X_AXIS_LABEL_OVERFLOW: IXAxisLabelOverflow = {
  x_axis: {
    width: 80,
    overflow: 'truncate',
    ellipsis: '...',
  },
  tooltip: {
    width: 200,
    overflow: 'break',
    ellipsis: '...',
  },
};
