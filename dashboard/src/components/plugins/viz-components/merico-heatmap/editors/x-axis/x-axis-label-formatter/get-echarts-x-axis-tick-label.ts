import { IXAxisLabelFormatter } from './types';

export type FormatterFuncType = (value: string | number, index?: number) => string | number;

export function getEchartsXAxisLabel({ enabled, func_content }: IXAxisLabelFormatter): FormatterFuncType {
  return (value: number | string, index?: number) => {
    if (!enabled) {
      return value;
    }
    try {
      return new Function(`return ${func_content}`)()(value, index);
    } catch (error) {
      // @ts-expect-error Object is of type 'unknown'.
      console.error(`[getEchartsXAxisLabel] failed parsing custom function, error: ${error.message}`);
      return value;
    }
  };
}
