import { createStyles, Text } from '@mantine/core';
import chroma from 'chroma-js';
import { PropsWithChildren } from 'react';
import { AnyObject } from '~/types';
import { formatNumber } from '~/utils';
import { ColumnAlignType, ITableCellContext, ValueType } from '../type';
import { AlignmentToFlexJustify } from '../utils';

const useCellStyles = createStyles((theme, params: { clickable?: boolean; align: ColumnAlignType }) => ({
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: AlignmentToFlexJustify[params.align],
    '.table-cell-text': {
      whiteSpace: 'nowrap',
      cursor: params.clickable ? 'pointer' : 'default',
      textDecoration: params.clickable ? 'underline' : 'none',
    },
  },
}));

function getTextColor(bgColor?: string) {
  if (!bgColor) {
    return 'inherit';
  }
  return (chroma(bgColor) as AnyObject).oklch()[0] > 0.7 ? 'black' : 'white';
}

function getCellStyle(cell: ICellValue) {
  const bgColor = cell.tableCellContext.bgColor;
  return {
    backgroundColor: bgColor,
    color: getTextColor(bgColor),
  };
}

function CellRender(props: PropsWithChildren<ICellValue>) {
  const clickable = props.tableCellContext.isClickable();
  const cellStyles = useCellStyles({ clickable, align: props.align });
  return (
    <div
      className={cellStyles.classes.content}
      style={{
        ...getCellStyle(props),
      }}
    >
      <Text className="table-cell-text" onClick={props.tableCellContext.getClickHandler()}>
        <span title={props.children as string}>{props.children}</span>
      </Text>
    </div>
  );
}

function StringCell(props: ICellValue) {
  return <CellRender {...props}>{props.value}</CellRender>;
}

function ELOCCell(props: ICellValue) {
  const v = formatNumber(props.value, {
    output: 'number',
    average: true,
    mantissa: 2,
    trimMantissa: true,
    absolute: false,
  });
  return <CellRender {...props}>{v}</CellRender>;
}

function NumberCell(props: ICellValue) {
  const num = formatNumber(props.value, { output: 'number', mantissa: 0, thousandSeparated: true, absolute: false });
  return <CellRender {...props}>{num}</CellRender>;
}

function PercentageCell(props: ICellValue) {
  const num = formatNumber(props.value, { output: 'percent', mantissa: 3, trimMantissa: true, absolute: false });
  return <CellRender {...props}>{num}</CellRender>;
}

function CustomCell(props: ICellValue) {
  const value = props.value;
  const func_content = props.func_content;
  if (!func_content) {
    return <CellRender {...props}>{value}</CellRender>;
  }
  const v = new Function(`return ${func_content}`)()({ value });
  return <CellRender {...props}>{v}</CellRender>;
}

interface ICellValue {
  value: string | number;
  type: ValueType;
  tableCellContext: ITableCellContext;
  func_content?: string;
  align: ColumnAlignType;
}

export function CellValue(props: ICellValue) {
  switch (props.type) {
    case ValueType.string:
      return <StringCell {...props} />;
    case ValueType.eloc:
      return <ELOCCell {...props} />;
    case ValueType.number:
      return <NumberCell {...props} />;
    case ValueType.percentage:
      return <PercentageCell {...props} />;
    case ValueType.custom:
      return <CustomCell {...props} />;
  }
}
