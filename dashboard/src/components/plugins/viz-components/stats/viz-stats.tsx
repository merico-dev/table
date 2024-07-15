import { Box, Flex, Sx } from '@mantine/core';
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

function getWrapperSx(triggersCount: number) {
  const ret: Sx = {
    flexGrow: 1,
  };
  if (triggersCount > 0) {
    ret.cursor = 'pointer';
    ret['&:hover'] = {
      textDecoration: 'underline',
    };
  }
  return ret;
}

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

  return (
    <Flex
      className="viz-stats"
      sx={{
        width,
        height,
      }}
      align={verticalAlignments[confValue.vertical_align]}
      direction="row"
    >
      <Box className="viz-stats--clickable-wrapper" sx={getWrapperSx(triggers.length)} onClick={handleContentClick}>
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
    </Flex>
  );
});
