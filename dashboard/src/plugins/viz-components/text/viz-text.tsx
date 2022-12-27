import { Text } from '@mantine/core';
import { useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { DEFAULT_CONFIG, IVizTextConf } from './type';

export const VizText = observer(({ context }: VizViewProps) => {
  const model = useModelContext();
  const { value: conf = DEFAULT_CONFIG } = useStorageData<IVizTextConf>(context.instanceData, 'config');
  const { variables } = context;
  const { func_content, horizontal_align } = conf;

  const content = useMemo(() => {
    return new Function(`return ${func_content}`)()({
      data: context.data,
      variables,
      filters: model.filters.values,
      context: model.context.current,
    });
  }, [func_content, context.data, variables, model.filters.values, model.context.current]);

  return <Text align={horizontal_align}>{content}</Text>;
});
