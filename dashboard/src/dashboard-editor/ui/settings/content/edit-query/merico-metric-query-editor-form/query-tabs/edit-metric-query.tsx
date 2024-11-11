import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { LinkMetricsToVariables } from './link-metrics-to-variables';
import { LinkMetricsToTimeAndStep } from './link-metrics-to-time-and-step';

type Props = {
  queryModel: QueryModelInstance;
};
export const EditMetricQuery = observer(({ queryModel }: Props) => {
  return (
    <Stack gap={16}>
      <LinkMetricsToVariables queryModel={queryModel} />
      <LinkMetricsToTimeAndStep queryModel={queryModel} />

      <Stack></Stack>
      <Stack></Stack>
    </Stack>
  );
});
