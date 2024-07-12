import { Box } from '@mantine/core';
import { useCallback, useMemo } from 'react';

import { defaults } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useStorageData } from '~/components/plugins/hooks';
import { ReadonlyRichText } from '~/components/widgets';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '~/types/plugin';
import { parseRichTextContent } from '~/utils';
import { ClickStats } from './triggers';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';

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
  const { value: confValue = DEFAULT_CONFIG } = useStorageData<IVizStatsConf>(context.instanceData, 'config');
  const { panel } = useRenderPanelContext();
  const { data, variables } = context;
  const { width, height } = context.viewport;

  const richTextContent = useMemo(() => {
    const conf = defaults({}, confValue, DEFAULT_CONFIG);
    if (!conf.content) {
      return '';
    }
    return parseRichTextContent(conf.content, variables, contentModel.payloadForViz, data);
  }, [confValue, variables, contentModel.payloadForViz]);

  const variableValueMap = panel.variableValueMap;
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
    <Box
      sx={{
        width,
        height,
        alignItems: verticalAlignments[confValue.vertical_align],
      }}
    >
      <Box sx={contentSx} onClick={handleContentClick}>
        <ReadonlyRichText
          value={richTextContent}
          styles={{
            root: {
              border: 'none',
              height: '100%',
            },
            content: {
              padding: 0,
            },
          }}
          dashboardState={contentModel.dashboardState}
          varaiables={variableValueMap}
        />
      </Box>
    </Box>
  );
});
