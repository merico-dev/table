import { IColorInterpolationConfig } from '~/types/plugin';
import { IClickCellContentConfig } from './triggers/click-cell-content';
import { HorizontalAlign } from '../../editor-components';

export enum ValueType {
  string = 'string',
  number = 'number',
  eloc = 'eloc',
  percentage = 'percentage',
  url = 'url',
  custom = 'custom',
}

export type TVizTablePagination = {
  page_size: number;
};
export function getDefaultVizTablePagination(): TVizTablePagination {
  return {
    page_size: 20,
  };
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
  ignored_column_keys: string;
  columns: IColumnConf[];
  fontSize: string;
  horizontalSpacing: string;
  verticalSpacing: string;
  striped: boolean;
  highlightOnHover: boolean;
  pagination: TVizTablePagination;
}

export const DEFAULT_CELL_FUNC_CONTENT = ['function text({ value, row_data }, utils) {', '    return value', '}'].join(
  '\n',
);

export const DEFAULT_CONFIG: ITableConf = {
  columns: [],
  fontSize: '14px',
  highlightOnHover: true,
  horizontalSpacing: '14px',
  query_id: '',
  striped: true,
  use_raw_columns: true,
  ignored_column_keys: '',
  verticalSpacing: '14px',
  pagination: getDefaultVizTablePagination(),
};

export interface ITableCellContext {
  getClickHandler(): (() => void) | undefined;

  isClickable(): boolean;

  bgColor: string | undefined;
}

export type TriggerConfigType = IClickCellContentConfig;
