import { Flex } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '~/types/plugin';
import { getVariableValueMap } from '../../cartesian/option/utils/variables';
import { ClickMericoStats, IClickMericoStatsConfig } from '../triggers';
import { DEFAULT_CONFIG, TMericoStatsConf } from '../type';
import { VizMericoStatsMetric } from './metric';

export const VizMericoStats = observer(({ context, instance }: VizViewProps) => {
  const { value: confValue } = useStorageData<TMericoStatsConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => _.defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const variableValueMap = useMemo(() => getVariableValueMap(data, variables), [variables, data]);

  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const triggers = useTriggerSnapshotList<IClickMericoStatsConfig>(
    interactionManager.triggerManager,
    ClickMericoStats.id,
  );

  const handleMetricClick = useCallback(
    (metricId: string, metricName: string) => {
      triggers.forEach((t) => {
        const triggerConfig = t.config;
        // Only invoke trigger if metricName is empty (match all) or matches the clicked metric
        if (!triggerConfig?.metricName || triggerConfig.metricName === metricName) {
          interactionManager.runInteraction(t.id, { variables: variableValueMap, metricName });
        }
      });
    },
    [variableValueMap, triggers, interactionManager],
  );

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
        <VizMericoStatsMetric
          key={m.id}
          metric={m}
          variableValueMap={variableValueMap}
          onClick={handleMetricClick}
          hasInteraction={triggers.length > 0}
        />
      ))}
    </Flex>
  );
});
