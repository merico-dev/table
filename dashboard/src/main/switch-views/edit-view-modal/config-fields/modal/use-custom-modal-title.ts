import { useMemo } from 'react';
import { useModelContext } from '~/contexts';
import { ICustomModalTitle } from './modal-title-editor/types';

export function useCustomModalTitle({ enabled, func_content }: ICustomModalTitle, fallback: string) {
  const model = useModelContext();
  const title = useMemo(() => {
    if (!enabled) {
      return fallback;
    }
    try {
      return new Function(`return ${func_content}`)()({
        filters: model.filters.values,
        context: model.context.current,
      });
    } catch (error) {
      console.error(error);
      return fallback;
    }
  }, [func_content, model.filters.values, model.context.current, fallback]);

  return title;
}
