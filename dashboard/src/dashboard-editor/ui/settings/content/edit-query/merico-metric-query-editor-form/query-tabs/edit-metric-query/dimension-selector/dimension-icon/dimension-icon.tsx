import { DimensionOption } from '../type';
import { DimensionIconBoolean } from './boolean';
import { DimensionIconDate } from './date';
import { DimensionIconNumber } from './number';
import { DimensionIconString } from './string';

export const DimensionIcon = ({ type }: { type: DimensionOption['type'] }) => {
  switch (type) {
    case 'boolean':
      return <DimensionIconBoolean />;
    case 'date':
      return <DimensionIconDate />;
    case 'number':
      return <DimensionIconNumber />;
    case 'string':
      return <DimensionIconString />;
    default:
      return null;
  }
};
