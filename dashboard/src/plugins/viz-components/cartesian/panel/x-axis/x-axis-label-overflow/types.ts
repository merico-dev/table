export interface IXAxisLabelOverflow {
  x_axis: {
    width: number;
    overflow: 'truncate' | 'break' | 'breakAll';
    ellipsis: '...';
  };
  tooltip: {
    width: number;
    overflow: 'truncate' | 'break' | 'breakAll';
    ellipsis: '...';
  };
}

export const DEFAULT_X_AXIS_LABEL_OVERFLOW: IXAxisLabelOverflow = {
  x_axis: {
    width: 60,
    overflow: 'truncate',
    ellipsis: '...',
  },
  tooltip: {
    width: 200,
    overflow: 'break',
    ellipsis: '...',
  },
};
