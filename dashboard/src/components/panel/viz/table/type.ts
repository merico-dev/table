
export enum ValueType {
  string =  'string',
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
  size: string;
  horizontalSpacing: string;
  verticalSpacing: string;
  striped: boolean;
  highlightOnHover: boolean;
}
