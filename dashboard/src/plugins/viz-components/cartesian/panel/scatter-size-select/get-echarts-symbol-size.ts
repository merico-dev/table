import { keyBy } from 'lodash';
import { interpolate } from 'popmotion';
import { AnyObject } from '~/types';
import { TScatterSize, TScatterSize_Interpolation, TScatterSize_Static } from './types';

export function getEchartsSymbolSize({ type, ...rest }: TScatterSize, data: AnyObject[], x_axis_data_key: string) {
  if (!type) {
    return 10;
  }
  if (type === 'static') {
    const { size } = rest as TScatterSize_Static;
    return size;
  }
  console.log(type, rest);
  const { data_key, points } = rest as TScatterSize_Interpolation;
  const mapper = interpolate(
    points.map((p) => p.value),
    points.map((p) => p.size),
    { clamp: true },
  );
  const rows = keyBy(data, x_axis_data_key);
  return (_value: number, params: $TSFixMe) => {
    const row = rows[params.name];
    const value = row[data_key];
    console.log({ row, params, data_key, value });
    return mapper(Number(value));
  };
}
