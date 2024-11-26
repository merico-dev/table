import { DimensionColDataType } from '~/dashboard-editor/model/datasources/mm-info/metric-detail';
import { DimensionIconBoolean } from './boolean';
import { DimensionIconDate } from './date';
import { DimensionIconNumber } from './number';
import { DimensionIconString } from './string';
import { DimensionIconDimension } from './dimension';

export const DimensionIcon = ({ type }: { type: DimensionColDataType | 'dimension' | null }) => {
  switch (type) {
    case 'boolean':
      return <DimensionIconBoolean />;
    case 'date':
      return <DimensionIconDate />;
    case 'number':
      return <DimensionIconNumber />;
    case 'string':
      return <DimensionIconString />;
    case 'dimension':
      return <DimensionIconDimension />;
    default:
      return null;
  }
};
