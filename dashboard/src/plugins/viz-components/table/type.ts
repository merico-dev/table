import { IColorInterpolationConfig } from '~/types/plugin';

export enum ValueType {
  string = 'string',
  number = 'number',
  eloc = 'eloc',
  percentage = 'percentage',
}

export type CellBackgroundColorType = string | IColorInterpolationConfig;

export interface IColumnConf {
  label: string;
  value_field: string;
  value_type: ValueType;
  cellBackgroundColor?: CellBackgroundColorType;
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
  fontSize: '1rem',
  highlightOnHover: false,
  horizontalSpacing: '1em',
  id_field: '',
  striped: false,
  use_raw_columns: false,
  verticalSpacing: '1em',
};

export interface ITableCellContext {
  getClickHandler(): (() => void) | undefined;

  isClickable(): boolean;

  bgColor: string | undefined;
}
