import { Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useRenderContentModelContext } from '~/contexts';
import { formatNumber } from '~/utils';
import { TMericoStatsMetric } from '../type';

const Postfix = ({ postfix }: { postfix: string | null }) => {
  if (!postfix) {
    return null;
  }

  return (
    <>
      <Text size="12px" c="#818388" sx={{ lineHeight: 1 }}>
        /
      </Text>
      <Text size="12px" c="#818388" sx={{ lineHeight: 1 }}>
        {postfix}
      </Text>
    </>
  );
};

type Props = {
  metric: TMericoStatsMetric;
  variableValueMap: Record<string, string | number>;
  onClick: (metricId: string, metricName: string) => void;
  hasInteraction: boolean;
};
export const VizMericoStatsMetric = observer(({ metric, variableValueMap, onClick, hasInteraction }: Props) => {
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

  const handleClick = () => {
    if (hasInteraction) {
      onClick(metric.id, names.value);
    }
  };

  return (
    <Stack
      gap={18}
      onClick={handleClick}
      sx={{
        position: 'relative',
        cursor: hasInteraction ? 'pointer' : 'default',
        padding: '8px',
        '&::before': hasInteraction
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '8px',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s ease',
              pointerEvents: 'none',
            }
          : undefined,
        '&:hover::before': hasInteraction
          ? {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }
          : undefined,
      }}
    >
      <Stack gap={12}>
        <Text size="14px" c="#818388">
          {names.value}
        </Text>
        <Group gap="2px" align="baseline">
          <Text size="24px" fw="bold" c="#3D3E45" sx={{ lineHeight: 1 }}>
            {formatNumber(variableValueMap[data_keys.value], formatter)}
          </Text>
          <Postfix postfix={postfixContent} />
        </Group>
      </Stack>
      <Stack gap={12}>
        <Text size="14px" c="#818388">
          {names.basis}
        </Text>
        <Group gap="2px" align="baseline">
          <Text size="12px" c="#3D3E45" sx={{ lineHeight: 1 }}>
            {formatNumber(variableValueMap[data_keys.basis], formatter)}
          </Text>
          <Postfix postfix={postfixContent} />
        </Group>
      </Stack>
    </Stack>
  );
});
