import { Box, Center } from '@mantine/core';
import React, { useCallback, useMemo } from 'react';

import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useStorageData } from '~/components/plugins/hooks';
import { useRenderContentModelContext } from '~/contexts';
import { VizViewProps } from '~/types/plugin';
import { formatAggregatedValue, getAggregatedValue, templateToJSX } from '~/utils';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { ClickStats } from './triggers';

const horizontalAlignments = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const verticalAlignments = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
};

export const VizStats = observer(({ context, instance }: VizViewProps) => {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const triggers = useTriggerSnapshotList<IVizStatsConf>(interactionManager.triggerManager, ClickStats.id);

  const contentModel = useRenderContentModelContext();
  const { value: conf = DEFAULT_CONFIG } = useStorageData<IVizStatsConf>(context.instanceData, 'config');
  const { data, variables } = context;
  const { template, horizontal_align, vertical_align } = conf;
  const { width, height } = context.viewport;

  const semiTemplate = useMemo(() => {
    try {
      return _.template(template)(contentModel.payloadForSQL);
    } catch (error) {
      return template;
    }
  }, [contentModel.payloadForSQL, template]);

  const contents = useMemo(() => {
    return templateToJSX(semiTemplate, variables, context.data);
  }, [semiTemplate, variables, context.data, context]);

  const variableValueMap = useMemo(() => {
    return variables.reduce((prev, variable) => {
      const value = getAggregatedValue(variable, data);
      prev[variable.name] = formatAggregatedValue(variable, value);
      return prev;
    }, {} as Record<string, string | number>);
  }, [data, variables]);

  const handleContentClick = useCallback(() => {
    triggers.forEach((t) => {
      interactionManager.runInteraction(t.id, { variables: variableValueMap });
    });
  }, [variableValueMap, triggers, interactionManager]);

  const contentSx =
    triggers.length > 0
      ? {
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
          },
        }
      : {};
  return (
    <Center
      sx={{
        width,
        height,
        justifyContent: horizontalAlignments[horizontal_align],
        alignItems: verticalAlignments[vertical_align],
      }}
    >
      <Box sx={contentSx} onClick={handleContentClick}>
        {Object.values(contents).map((c, i) => (
          <React.Fragment key={i}>{c}</React.Fragment>
        ))}
      </Box>
    </Center>
  );
});
