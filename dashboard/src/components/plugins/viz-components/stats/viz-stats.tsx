import { Box, Flex } from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { EmotionSx } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import { useStorageData } from '~/components/plugins/hooks';
import { ReadonlyRichText } from '~/components/widgets';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '~/types/plugin';
import { parseRichTextContent } from '~/utils';
import { notifyVizRendered } from '../viz-instance-api';
import { ClickStats } from './triggers';
import { IVizStatsConf } from './type';

const verticalAlignments = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
};

function getWrapperSx(triggersCount: number) {
  const ret: EmotionSx = {
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

type RenderProps = VizViewProps;
export const Render = observer(({ context, instance }: RenderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const triggers = useTriggerSnapshotList<IVizStatsConf>(interactionManager.triggerManager, ClickStats.id);

  const contentModel = useRenderContentModelContext();

  const { panel } = useRenderPanelContext();
  const conf = panel.viz.conf.config as IVizStatsConf;

  const { data, variables } = context;
  const { width, height } = context.viewport;

  const richTextContent = useMemo(() => {
    const conf = panel.viz.conf.config;
    if (!conf.content) {
      return '';
    }
    return parseRichTextContent(conf.content, variables, contentModel.payloadForViz, data);
  }, [data, panel, variables, contentModel.payloadForViz]);
  useEffect(() => {
    notifyVizRendered(instance, { content: richTextContent });
  }, [richTextContent]);

  const handleContentClick = useCallback(() => {
    triggers.forEach((t) => {
      interactionManager.runInteraction(t.id, { variables: panel.variableValueMap });
    });
  }, [panel.variableValueMap, triggers, interactionManager]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const div: HTMLDivElement | null = ref.current.querySelector('.ProseMirror');
    if (!div) {
      return;
    }

    const { offsetWidth, offsetHeight } = div;
    const scaleW = width / offsetWidth;
    const scaleH = height / offsetHeight;
    const scale = Math.min(scaleW, scaleH);
    div.style.transform = `scale(${scale})`;
  }, [ref.current, width, height, richTextContent]);
  return (
    <Flex
      className="viz-stats"
      sx={{
        width,
        height,
      }}
      align={verticalAlignments[conf.vertical_align]}
      direction="row"
    >
      <Box className="viz-stats--clickable-wrapper" sx={getWrapperSx(triggers.length)} onClick={handleContentClick}>
        <ReadonlyRichText
          ref={ref}
          value={richTextContent}
          styles={{
            root: {
              border: 'none',
              maxWidth: width,
              maxHeight: height,
              '&.mantine-RichTextEditor-root': {
                overflow: 'hidden !important',
              },
            },
            content: {
              height,
              '&.mantine-RichTextEditor-content .ProseMirror': {
                margin: '0 auto',
                padding: 0,
                display: 'table',
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                transformOrigin: 'top center',
              },
              '&.mantine-RichTextEditor-content .ProseMirror > p': {
                fontSize: 'initial',
                lineHeight: 'initial',
              },
            },
          }}
          dashboardState={contentModel.dashboardState}
          variableAggValueMap={panel.variableAggValueMap}
        />
      </Box>
    </Flex>
  );
});

export const VizStats = (props: VizViewProps) => {
  const { context } = props;
  const { value: conf } = useStorageData<IVizStatsConf>(context.instanceData, 'config');

  if (!conf) {
    return null;
  }

  return <Render {...props} />;
};
