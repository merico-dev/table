import { Box, Flex, Stack, Text } from '@mantine/core';
import _ from 'lodash';
import { useMemo } from 'react';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { DEFAULT_CONFIG, TMericoStatsConf } from './type';
import { getVariableValueMap } from '../cartesian/option/utils/variables';
import numbro from 'numbro';

export function VizMericoStats({ context, instance }: VizViewProps) {
  const { value: confValue } = useStorageData<TMericoStatsConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => _.defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const variableValueMap = useMemo(() => getVariableValueMap(data, variables), [variables, data]);

  const { width, height } = context.viewport;

  if (!width || !height || !conf) {
    return null;
  }
  return (
    <Flex
      w={`${width}px`}
      h={`${height}px`}
      justify={conf.styles.justify}
      align={conf.styles.align}
      direction="row"
      wrap="nowrap"
      sx={{ overflow: 'hidden' }}
    >
      {conf.metrics.map((m) => (
        <Stack key={m.id} spacing={18}>
          <Stack spacing={12}>
            <Text size="14px" color="#818388">
              {m.names.value}
            </Text>
            <Text size="24px" color="#000000" sx={{ lineHeight: 1 }}>
              {numbro(variableValueMap[m.data_keys.value]).format(m.formatter)}
            </Text>
          </Stack>
          <Stack spacing={12}>
            <Text size="14px" color="#818388">
              {m.names.basis}
            </Text>
            <Text size="12px" color="#000000" sx={{ lineHeight: 1 }}>
              {numbro(variableValueMap[m.data_keys.basis]).format(m.formatter)}
            </Text>
          </Stack>
        </Stack>
      ))}
    </Flex>
  );
}
