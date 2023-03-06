import { IEchartsOverflow } from '~/plugins/common-echarts-fields/axis-label-overflow';

export interface IXAxisLabelOverflow {
  x_axis: IEchartsOverflow;
  tooltip: IEchartsOverflow;
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
