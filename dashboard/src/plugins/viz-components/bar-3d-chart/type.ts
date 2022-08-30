export interface Axis3DType {
  type: string;
  name: string;
}

export interface IBar3dChartConf {
  x_axis_data_key: string;
  y_axis_data_key: string;
  z_axis_data_key: string;
  xAxis3D: Axis3DType;
  yAxis3D: Axis3DType;
  zAxis3D: Axis3DType;
}

export const DEFAULT_CONFIG: IBar3dChartConf = {
  x_axis_data_key: '',
  y_axis_data_key: '',
  z_axis_data_key: '',
  xAxis3D: {
    type: 'value',
    name: 'X Axis Name',
  },
  yAxis3D: {
    type: 'value',
    name: 'Y Axis Name',
  },
  zAxis3D: {
    type: 'value',
    name: 'Z Axis Name',
  },
};
