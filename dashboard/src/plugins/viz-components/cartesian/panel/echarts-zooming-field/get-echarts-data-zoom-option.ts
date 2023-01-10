import { TEchartsDataZoomConfig } from './types';

export function getEchartsDataZoomOption(conf: TEchartsDataZoomConfig) {
  const ret = [];
  if (conf.x_axis_scroll) {
    ret.push({
      type: 'inside',
      xAxisIndex: [0],
    });
  }
  if (conf.y_axis_scroll) {
    ret.push({
      type: 'inside',
      yAxisIndex: [0],
    });
  }
  return ret;
}
