import { IColorInterpolationConfig } from '~/types/plugin';
import { IClickCellContentConfig } from './triggers/click-cell-content';
import { HorizontalAlign } from '../../editor-components';

export enum ValueType {
  string = 'string',
  number = 'number',
  eloc = 'eloc',
  percentage = 'percentage',
  custom = 'custom',
}

export type CellBackgroundColorType = string | IColorInterpolationConfig;

export type ColumnAlignType = HorizontalAlign;

export interface IColumnConf {
  id: string;
  label: string;
  value_field: TDataKey;
  value_type: ValueType;
  cellBackgroundColor?: CellBackgroundColorType;
  func_content?: string;
  width: number | '';
  min_width?: number;
  max_width?: number;
  align: ColumnAlignType;
}

export interface ITableConf {
  query_id: string;
  use_raw_columns: boolean;
  columns: IColumnConf[];
  fontSize: string;
  horizontalSpacing: string;
  verticalSpacing: string;
  striped: boolean;
  highlightOnHover: boolean;
}

export const DEFAULT_CELL_FUNC_CONTENT = ['function text({ value }, utils) {', '    return value', '}'].join('\n');

export const DEFAULT_CONFIG: ITableConf = {
  columns: [],
  fontSize: '14px',
  highlightOnHover: true,
  horizontalSpacing: '14px',
  query_id: '',
  striped: true,
  use_raw_columns: true,
  verticalSpacing: '14px',
};

export interface ITableCellContext {
  getClickHandler(): (() => void) | undefined;

  isClickable(): boolean;

  bgColor: string | undefined;
}

export type TriggerConfigType = IClickCellContentConfig;
