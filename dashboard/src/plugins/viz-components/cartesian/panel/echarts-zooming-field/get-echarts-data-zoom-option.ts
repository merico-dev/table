import { TEchartsDataZoomConfig } from './types';

export function getEchartsDataZoomOption(conf: TEchartsDataZoomConfig) {
  const ret = [];
  if (conf.x_axis_scroll) {
    ret.push({
      type: 'inside',
      xAxisIndex: [0],
      filterMode: 'none',
    });
  }
  if (conf.y_axis_scroll) {
    ret.push({
      type: 'inside',
      yAxisIndex: [0],
      filterMode: 'none',
    });
  }
  if (conf.x_axis_slider) {
    ret.push({
      type: 'slider',
      xAxisIndex: [0],
      filterMode: 'none',
      bottom: 'auto',
      top: 0,
      height: 15,
      moveHandleSize: 0,
      showDataShadow: false,
    });
  }
  return ret;
}
