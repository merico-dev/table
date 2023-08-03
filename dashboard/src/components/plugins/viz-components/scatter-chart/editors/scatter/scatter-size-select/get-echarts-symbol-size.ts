import lodash from 'lodash';
import { interpolate } from 'popmotion';
import { TScatterSize, TScatterSize_Dynamic, TScatterSize_Static } from './types';

export function getEchartsSymbolSize(
  { type, ...rest }: TScatterSize,
  variableValueMap: Record<string, string | number>,
) {
  if (!type) {
    return 10;
  }
  if (type === 'static') {
    const { size } = rest as TScatterSize_Static;
    return size;
  }
  const { func_content } = rest as TScatterSize_Dynamic;
  return (_value: number, params: $TSFixMe) => {
    const rowData = params.data;
    try {
      return new Function(`return ${func_content}`)()(
        { rowData, params, variables: variableValueMap },
        { lodash, interpolate },
      );
    } catch (error) {
      // @ts-expect-error Object is of type 'unknown'.
      console.error(`[getEchartsSymbolSize] failed parsing custom function, error: ${error.message}`);
      return 10;
    }
  };
}
