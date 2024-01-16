import { TEchartsDataZoomConfig } from './types';

type FilterMode = 'none' | 'filter';

export function getEchartsDataZoomOption(conf: TEchartsDataZoomConfig, filterMode?: FilterMode) {
  if (!filterMode) {
    filterMode = 'none';
  }

  const ret = [];
  if (conf.x_axis_scroll) {
    ret.push({
      type: 'inside',
      xAxisIndex: [0],
      filterMode,
      minSpan: 1,
    });
  }
  if (conf.y_axis_scroll) {
    ret.push({
      type: 'inside',
      yAxisIndex: [0],
      filterMode,
      minSpan: 1,
    });
  }
  if (conf.x_axis_slider) {
    ret.push({
      type: 'slider',
      xAxisIndex: [0],
      filterMode,
      bottom: 'auto',
      top: 0,
      height: 15,
      moveHandleSize: 0,
      showDataShadow: false,
      minSpan: 1,
    });
  }
  return ret;
}
