export enum ValueType {
  string = 'string',
  number = 'number',
  eloc = 'eloc',
  percentage = 'percentage',
}

export interface IColumnConf {
  label: string;
  value_field: string;
  value_type: ValueType;
}

export interface ITableConf {
  id_field: string;
  use_raw_columns: boolean;
  columns: IColumnConf[];
  fontSize: string;
  horizontalSpacing: string;
  verticalSpacing: string;
  striped: boolean;
  highlightOnHover: boolean;
}

export const DEFAULT_CONFIG: ITableConf = {
  columns: [],
  fontSize: '',
  highlightOnHover: false,
  horizontalSpacing: '',
  id_field: '',
  striped: false,
  use_raw_columns: false,
  verticalSpacing: '',
};
