import { keyBy } from 'lodash';
import { AnyObject } from '~/types';
import { TScatterSize, TScatterSize_Dynamic, TScatterSize_Static } from './types';

export function getEchartsSymbolSize({ type, ...rest }: TScatterSize, data: AnyObject[], x_axis_data_key: string) {
  if (!type) {
    return 10;
  }
  if (type === 'static') {
    const { size } = rest as TScatterSize_Static;
    return size;
  }
  const { func_content } = rest as TScatterSize_Dynamic;
  const rows = keyBy(data, x_axis_data_key);
  return (_value: number, params: $TSFixMe) => {
    const row = rows[params.name];
    try {
      return new Function(`return ${func_content}`)()(row, params);
    } catch (error) {
      // @ts-expect-error Object is of type 'unknown'.
      console.error(`[getEchartsSymbolSize] failed parsing custom function, error: ${error.message}`);
      return 10;
    }
  };
}
