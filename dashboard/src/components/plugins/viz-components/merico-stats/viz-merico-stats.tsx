import { Flex, Group, Stack, Text } from '@mantine/core';
import _ from 'lodash';
import numbro from 'numbro';
import { useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { getVariableValueMap } from '../cartesian/option/utils/variables';
import { DEFAULT_CONFIG, TMericoStatsConf, TMetricPostfix } from './type';
import { observer } from 'mobx-react-lite';
import { useRenderContentModelContext } from '~/contexts';

const Postfix = observer(({ postfix }: { postfix: TMetricPostfix }) => {
  const contentModel = useRenderContentModelContext();

  const postfixContent = useMemo(() => {
    if (postfix.type === 'text' && postfix.value) {
      return postfix.value;
    }

    if (postfix.type === 'filter-option-label' && postfix.value) {
      const filterOption = contentModel.filters.getSelectOption(postfix.value);
      if (!filterOption) {
        return null;
      }
      return filterOption.label;
    }

    return null;
  }, [postfix, contentModel]);

  if (!postfixContent) {
    return null;
  }

  return (
    <>
      <Text size="12px" color="#818388" sx={{ lineHeight: 1 }}>
        /
      </Text>
      <Text size="12px" color="#818388" sx={{ lineHeight: 1 }}>
        {postfixContent}
      </Text>
    </>
  );
});

export const VizMericoStats = observer(({ context, instance }: VizViewProps) => {
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
            <Group spacing="2px" align="baseline">
              <Text size="24px" fw="bold" color="#3D3E45" sx={{ lineHeight: 1 }}>
                {numbro(variableValueMap[m.data_keys.value]).format(m.formatter)}
              </Text>
              <Postfix postfix={m.postfix} />
            </Group>
          </Stack>
          <Stack spacing={12}>
            <Text size="14px" color="#818388">
              {m.names.basis}
            </Text>
            <Group spacing="2px" align="baseline">
              <Text size="12px" color="#3D3E45" sx={{ lineHeight: 1 }}>
                {numbro(variableValueMap[m.data_keys.basis]).format(m.formatter)}
              </Text>
              <Postfix postfix={m.postfix} />
            </Group>
          </Stack>
        </Stack>
      ))}
    </Flex>
  );
});
