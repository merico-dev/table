import { Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import numbro from 'numbro';
import { useMemo } from 'react';
import { useRenderContentModelContext } from '~/contexts';
import { TMericoStatsMetric } from '../type';

const Postfix = ({ postfix }: { postfix: string | null }) => {
  if (!postfix) {
    return null;
  }

  return (
    <>
      <Text size="12px" color="#818388" sx={{ lineHeight: 1 }}>
        /
      </Text>
      <Text size="12px" color="#818388" sx={{ lineHeight: 1 }}>
        {postfix}
      </Text>
    </>
  );
};

type Props = {
  metric: TMericoStatsMetric;
  variableValueMap: Record<string, string | number>;
};
export const VizMericoStatsMetric = observer(({ metric, variableValueMap }: Props) => {
  const { names, data_keys, formatter, postfix } = metric;
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

  return (
    <Stack spacing={18}>
      <Stack spacing={12}>
        <Text size="14px" color="#818388">
          {names.value}
        </Text>
        <Group spacing="2px" align="baseline">
          <Text size="24px" fw="bold" color="#3D3E45" sx={{ lineHeight: 1 }}>
            {numbro(variableValueMap[data_keys.value]).format(formatter)}
          </Text>
          <Postfix postfix={postfixContent} />
        </Group>
      </Stack>
      <Stack spacing={12}>
        <Text size="14px" color="#818388">
          {names.basis}
        </Text>
        <Group spacing="2px" align="baseline">
          <Text size="12px" color="#3D3E45" sx={{ lineHeight: 1 }}>
            {numbro(variableValueMap[data_keys.basis]).format(formatter)}
          </Text>
          <Postfix postfix={postfixContent} />
        </Group>
      </Stack>
    </Stack>
  );
});
