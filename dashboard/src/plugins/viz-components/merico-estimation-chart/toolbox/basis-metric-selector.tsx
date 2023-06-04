import { Group, NativeSelect, Text } from '@mantine/core';
import { IMericoEstimationChartConf } from '../type';
import { useMemo } from 'react';

const SelectorStyles = {
  input: {
    border: 'none !important',
    paddingLeft: 0,
    lineHeight: '1.55 !important',
  },
};

export interface IBasisMetricSelector {
  conf: IMericoEstimationChartConf;
  metricKey: string;
  setMetricKey: (v: string) => void;
}

export const BasisMetricSelector = ({ conf, metricKey, setMetricKey }: IBasisMetricSelector) => {
  const { deviation, metrics } = conf;
  const options = useMemo(() => {
    const ret = metrics.map((m) => ({
      label: m.name,
      value: m.data_key,
    }));
    ret.push({
      label: deviation.name ? deviation.name : deviation.data_keys.actual_value,
      value: deviation.data_keys.actual_value,
    });
    return ret;
  }, [deviation, metrics]);

  return (
    <Group spacing={1}>
      <Text size={12} color="dimmed" sx={{ cursor: 'default', userSelect: 'none' }}>
        基线指标
      </Text>
      <NativeSelect
        size="xs"
        data={options}
        value={metricKey}
        onChange={(e) => setMetricKey(e.currentTarget.value)}
        styles={SelectorStyles}
      />
    </Group>
  );
};
