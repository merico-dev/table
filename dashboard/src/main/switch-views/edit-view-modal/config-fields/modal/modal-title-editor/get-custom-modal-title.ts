import { ICustomModalTitle } from './types';

export function getCustomModalTitle({ enabled, func_content }: ICustomModalTitle) {
  return (value: number | string, index: number) => {
    if (!enabled) {
      return value;
    }
    try {
      return new Function(`return ${func_content}`)()(value, index);
    } catch (error) {
      // @ts-expect-error Object is of type 'unknown'.
      console.error(`[getCustomModalTitle] failed parsing custom function, error: ${error.message}`);
      return value;
    }
  };
}
