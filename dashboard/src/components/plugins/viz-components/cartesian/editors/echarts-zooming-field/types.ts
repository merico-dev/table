import _ from 'lodash';

export type TEchartsDataZoomConfig = {
  x_axis_scroll: boolean;
  y_axis_scroll: boolean;
  x_axis_slider: boolean;
  y_axis_slider: boolean;
};

export const DEFAULT_DATA_ZOOM_CONFIG = {
  x_axis_scroll: false,
  y_axis_scroll: false,
  x_axis_slider: false,
  y_axis_slider: false,
};

export function getDefaultDataZoomConfig() {
  return _.cloneDeep(DEFAULT_DATA_ZOOM_CONFIG);
}
