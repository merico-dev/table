import { createStyles, Text } from '@mantine/core';
import numbro from 'numbro';
import { PropsWithChildren } from 'react';
import { ValueType } from './type';

interface IXXCell {
  value: any;
  onContentClick?: () => void;
}

const useCellStyles = createStyles((theme, params: { clickable?: boolean }) => ({
  content: {
    cursor: params.clickable ? 'pointer' : 'default',
    textDecoration: params.clickable ? 'underline' : 'none',
  },
}));

function CellRender(props: PropsWithChildren<{ onClick?: () => void }>) {
  const clickable = !!props.onClick;
  const cellStyles = useCellStyles({ clickable });
  return (
    <Text className={cellStyles.classes.content} onClick={props.onClick}>
      {props.children}
    </Text>
  );
}

function StringCell({ value, onContentClick }: IXXCell) {
  return <CellRender onClick={onContentClick}>{value}</CellRender>;
}

function ELOCCell({ value, onContentClick }: IXXCell) {
  return <CellRender onClick={onContentClick}>{value}</CellRender>;
}

function NumberCell({ value, onContentClick }: IXXCell) {
  const num = numbro(value).format({ thousandSeparated: true });
  return <CellRender onClick={onContentClick}>{num}</CellRender>;
}

function PercentageCell({ value, onContentClick }: IXXCell) {
  const num = numbro(value).format({ output: 'percent', mantissa: 3 });
  return <CellRender onClick={onContentClick}>{num}</CellRender>;
}

interface ICellValue {
  value: any;
  type: ValueType;
  onContentClick?: () => void;
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
