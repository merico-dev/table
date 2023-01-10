import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from '../cartesian/panel/echarts-zooming-field/types';

export interface IParetoChartConf {
  x_axis: {
    name: string;
    data_key: string;
  };
  data_key: string;
  bar: {
    name: string;
    color: string;
  };
  line: {
    name: string;
    color: string;
  };
  dataZoom: TEchartsDataZoomConfig;
}

export const DEFAULT_CONFIG: IParetoChartConf = {
  x_axis: {
    name: 'X Axis',
    data_key: '',
  },
  data_key: 'value',
  bar: {
    name: 'Value',
    color: '#228be6',
  },
  line: {
    name: 'Value',
    color: 'red',
  },
  dataZoom: DEFAULT_DATA_ZOOM_CONFIG,
};
