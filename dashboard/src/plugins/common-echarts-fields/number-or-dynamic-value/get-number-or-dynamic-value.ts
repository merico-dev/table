import lodash from 'lodash';
import { interpolate } from 'popmotion';
import { TNumberOrDynamic, TNumberOrDynamic_Static, TNumberOrDynamic_Dynamic } from './types';

export function getNumberOrDynamicValue(
  { type, ...rest }: TNumberOrDynamic,
  variableValueMap: Record<string, string | number>,
) {
  if (!type) {
    return 10;
  }
  if (type === 'static') {
    const { value } = rest as TNumberOrDynamic_Static;
    return value;
  }
  const { value } = rest as TNumberOrDynamic_Dynamic;
  return (_value: number, params: $TSFixMe) => {
    const rowData = params.data;
    try {
      return new Function(`return ${value}`)()(
        { rowData, params, variables: variableValueMap },
        { lodash, interpolate },
      );
    } catch (error) {
      // @ts-expect-error Object is of type 'unknown'.
      console.error(`[getNumberOrDynamicValue] failed parsing custom function, error: ${error.message}`);
      return 10;
    }
  };
}
