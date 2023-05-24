export interface IPieChartConf {
  label_field: string;
  value_field: string;
  color_field: string;
}

export const DEFAULT_CONFIG: IPieChartConf = {
  label_field: '',
  value_field: '',
  color_field: '',
};
