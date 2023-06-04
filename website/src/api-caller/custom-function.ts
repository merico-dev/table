import { TCustomFunctionDefinition, TCustomFunctionDto } from './custom-function.types';
import { post } from './request';

export const custom_function = {
  get: (id: string, signal?: AbortSignal) => async (): Promise<TCustomFunctionDefinition | null> => {
    try {
      const res: TCustomFunctionDto = await post(signal)('/custom_function/get', { id });
      const ret = new Function(`return ${res.definition}`)() as TCustomFunctionDefinition;
      return ret;
    } catch (error) {
      return null;
    }
  },
};
