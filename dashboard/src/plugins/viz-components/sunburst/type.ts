export interface ISunburstConf {
  label_key: string;
  value_key: string;
  group_key: string;
}

export const DEFAULT_CONFIG: ISunburstConf = {
  label_key: '',
  value_key: '',
  group_key: '',
};
