export interface IXAxisLabelMaxLength {
  x_axis: {
    length: number;
    overflow: 'truncate' | 'break' | 'breakAll';
    ellipsis: '...';
  };
  tooltip: {
    length: number;
    overflow: 'truncate' | 'break' | 'breakAll';
    ellipsis: '...';
  };
}

export const DEFAULT_X_AXIS_LABEL_MAX_LENGTH: IXAxisLabelMaxLength = {
  x_axis: {
    length: 60,
    overflow: 'truncate',
    ellipsis: '...',
  },
  tooltip: {
    length: 60,
    overflow: 'truncate',
    ellipsis: '...',
  },
};
