import lodash from 'lodash';
import { interpolate } from 'popmotion';
import { TNumberOrDynamic, TNumberOrDynamic_Static, TNumberOrDynamic_Dynamic } from './types';

export function getNumberOrDynamicValue(
  conf: TNumberOrDynamic,
  variableValueMap: Record<string, string | number>,
  fallbackValue?: number,
) {
  if (!conf.type) {
    return fallbackValue;
  }

  if (conf.type === 'static') {
    const { value } = conf as TNumberOrDynamic_Static;
    return value;
  }

  const { value } = conf as TNumberOrDynamic_Dynamic;
  try {
    console.log('returning here');
    return new Function(`return ${value}`)()({ variables: variableValueMap }, { lodash, interpolate });
  } catch (error) {
    // @ts-expect-error Object is of type 'unknown'.
    console.error(`[getNumberOrDynamicValue] failed parsing custom function, error: ${error.message}`);
    return 10;
  }
}
