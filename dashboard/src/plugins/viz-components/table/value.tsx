import { Group, Text } from '@mantine/core';
import numbro from 'numbro';
import { ValueType } from './type';

interface IXXCell {
  value: any;
}

function StringCell({ value }: IXXCell) {
  return <Text component="span">{value}</Text>;
}

function ELOCCell({ value }: IXXCell) {
  return <Text component="span">{value}</Text>;
}

function NumberCell({ value }: { value: number | string }) {
  const num = numbro(value).format({ thousandSeparated: true });
  return <Text component="span">{num}</Text>;
}
function PercentageCell({ value }: { value: number | string }) {
  const num = numbro(value).format({ output: 'percent', mantissa: 3 });
  return <Text component="span">{num}</Text>;
}

interface ICellValue {
  value: any;
  type: ValueType;
}

export function CellValue({ value, type }: ICellValue) {
  switch (type) {
    case ValueType.string:
      return <StringCell value={value} />;
    case ValueType.eloc:
      return <ELOCCell value={value} />;
    case ValueType.number:
      return <NumberCell value={value} />;
    case ValueType.percentage:
      return <PercentageCell value={value} />;
  }
}
