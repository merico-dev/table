import { Center, Overlay, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { LinkMetricsToVariables } from './link-metrics-to-variables';
import { LinkMetricsToTimeAndStep } from './link-metrics-to-time-and-step';
import { SetGroupByMetrics } from './set-groupby-metrics';
import { MericoMetricQueryMetaInstance } from '~/model';
import { useEffect } from 'react';

type Props = {
  queryModel: QueryModelInstance;
};
export const EditMetricQuery = observer(({ queryModel }: Props) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  const metricID = config.id;

  useEffect(() => {
    if (queryModel.run_by.length === 0) {
      return;
    }

    const newRunBy: string[] = [];
    const set1 = config.usedFilterVariableSet;
    const set2 = config.usedTimeQueryVariableSet;
    queryModel.run_by.forEach((s) => {
      if (set1.has(s) || set2.has(s)) {
        newRunBy.push(s);
      }
    });
    queryModel.setRunBy(newRunBy);
  }, [config.usedFilterVariableSet, config.usedTimeQueryVariableSet, queryModel.run_by]);

  return (
    <Stack gap={16} pos="relative">
      {!metricID && (
        <Overlay color="#fff" backgroundOpacity={0.5} blur={3}>
          <Center h="100%">
            <Text size="sm" c="black">
              请先选择指标
            </Text>
          </Center>
        </Overlay>
      )}
      <LinkMetricsToVariables queryModel={queryModel} />
      <LinkMetricsToTimeAndStep queryModel={queryModel} />
      <SetGroupByMetrics queryModel={queryModel} />
    </Stack>
  );
});
