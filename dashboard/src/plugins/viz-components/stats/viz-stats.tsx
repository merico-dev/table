import { useMemo } from 'react';
import { Text } from '@mantine/core';

import { VizViewProps } from '~/types/plugin';
import { templateToJSX } from '~/utils/template';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';

export function VizStats({ context }: VizViewProps) {
  const { value: conf = DEFAULT_CONFIG } = useStorageData<IVizStatsConf>(context.instanceData, 'config');
  const { template, variables, align } = conf;
  const contents = useMemo(() => {
    return templateToJSX(template, variables, context.data as Record<string, number>[]);
  }, [template, variables, context.data]);
  return <Text align={align}>{Object.values(contents).map((c) => c)}</Text>;
}
