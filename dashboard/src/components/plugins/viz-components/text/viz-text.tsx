import { Text } from '@mantine/core';
import { useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useStorageData } from '~/components/plugins/hooks';
import { useRenderContentModelContext } from '~/contexts';
import { VizViewProps } from '~/types/plugin';
import { formatAggregatedValue, getAggregatedValue } from '~/utils';
import { DEFAULT_CONFIG, IVizTextConf } from './type';

export const VizText = observer(({ context }: VizViewProps) => {
  const contentModel = useRenderContentModelContext();
  const { value: conf = DEFAULT_CONFIG } = useStorageData<IVizTextConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data;
  const { func_content, horizontal_align, font_size, font_weight } = conf;

  const variableValueMap = useMemo(() => {
    return variables.reduce((prev, variable) => {
      const value = getAggregatedValue(variable, data);
      prev[variable.name] = formatAggregatedValue(variable, value);
      return prev;
    }, {} as Record<string, string | number>);
  }, [variables, data]);

  const content = useMemo(() => {
    return new Function(`return ${func_content}`)()({
      data,
      variables: variableValueMap,
      filters: contentModel.payloadForSQL.filters,
      context: contentModel.payloadForSQL.context,
    });
  }, [func_content, data, variableValueMap, contentModel.payloadForSQL]);

  return (
    <Text ta={horizontal_align} fw={font_weight} sx={{ fontSize: font_size }}>
      {content}
    </Text>
  );
});
