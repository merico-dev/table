import { IColorInterpolationConfig } from '~/types/plugin';
import { IClickCellContentConfig } from './triggers/click-cell-content';

export enum ValueType {
  string = 'string',
  number = 'number',
  eloc = 'eloc',
  percentage = 'percentage',
  custom = 'custom',
}

export type CellBackgroundColorType = string | IColorInterpolationConfig;

export interface IColumnConf {
  id: string;
  label: string;
  value_field: string;
  value_type: ValueType;
  cellBackgroundColor?: CellBackgroundColorType;
  func_content?: string;
  width?: number;
  min_width?: number;
  max_width?: number;
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

export const DEFAULT_CELL_FUNC_CONTENT = [
  'function text({ value }) {',
  '    // your code goes here',
  '    return value',
  '}',
].join('\n');

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

export type TriggerConfigType = IClickCellContentConfig;
