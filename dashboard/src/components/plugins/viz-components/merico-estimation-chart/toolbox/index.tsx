import { Group } from '@mantine/core';
import { BasisMetricSelector, IBasisMetricSelector } from './basis-metric-selector';
import { MetricsDescription } from './metric-description';

export function Toolbox(props: IBasisMetricSelector) {
  return (
    <Group justify="space-between">
      <MetricsDescription />
      <BasisMetricSelector {...props} />
    </Group>
  );
}
