import { TScatterSize, TScatterSize_Interpolation, TScatterSize_Static } from './types';

export function getEchartsSymbolSize({ type, ...rest }: TScatterSize) {
  if (type === 'static') {
    const { size } = rest as TScatterSize_Static;
    return size;
  }
  const { data_key, size_range, value_range } = rest as TScatterSize_Interpolation;
  // TODO
  return 10;
}
