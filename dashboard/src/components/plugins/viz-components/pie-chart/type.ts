export interface IPieChartConf {
  label_field: TDataKey;
  value_field: TDataKey;
  color_field: TDataKey;
}

export const DEFAULT_CONFIG: IPieChartConf = {
  label_field: '',
  value_field: '',
  color_field: '',
};
