import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { LinkMetricsToVariables } from './link-metrics-to-variables';

type Props = {
  queryModel: QueryModelInstance;
};
export const EditMetricQuery = observer(({ queryModel }: Props) => {
  return (
    <Stack>
      <LinkMetricsToVariables queryModel={queryModel} />

      <Stack></Stack>
      <Stack></Stack>
    </Stack>
  );
});
