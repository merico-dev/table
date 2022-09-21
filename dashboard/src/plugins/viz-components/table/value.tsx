import { createStyles, Text } from '@mantine/core';
import numbro from 'numbro';
import { PropsWithChildren } from 'react';
import { ITableCellContext, ValueType } from './type';

const useCellStyles = createStyles((theme, params: { clickable?: boolean }) => ({
  content: {
    cursor: params.clickable ? 'pointer' : 'default',
    textDecoration: params.clickable ? 'underline' : 'none',
  },
}));

function CellRender(props: PropsWithChildren<ICellValue>) {
  const clickable = props.tableCellContext.isClickable();
  const cellStyles = useCellStyles({ clickable });
  return (
    <Text className={cellStyles.classes.content} onClick={props.tableCellContext.getClickHandler()}>
      {props.children}
    </Text>
  );
}

function StringCell(props: ICellValue) {
  return <CellRender {...props}>{props.value}</CellRender>;
}

function ELOCCell(props: ICellValue) {
  return <CellRender {...props}>{props.value}</CellRender>;
}

function NumberCell(props: ICellValue) {
  const num = numbro(props.value).format({ thousandSeparated: true });
  return <CellRender {...props}>{num}</CellRender>;
}

function PercentageCell(props: ICellValue) {
  const num = numbro(props.value).format({ output: 'percent', mantissa: 3 });
  return <CellRender {...props}>{num}</CellRender>;
}

interface ICellValue {
  value: $TSFixMe;
  type: ValueType;
  tableCellContext: ITableCellContext;
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
  }
}
