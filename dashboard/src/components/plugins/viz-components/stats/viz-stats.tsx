import { Box, Flex, Sx } from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { useStorageData } from '~/components/plugins/hooks';
import { ReadonlyRichText } from '~/components/widgets';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '~/types/plugin';
import { parseRichTextContent } from '~/utils';
import { ClickStats } from './triggers';
import { IVizStatsConf } from './type';

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

  const handleContentClick = useCallback(() => {
    triggers.forEach((t) => {
      interactionManager.runInteraction(t.id, { variables: panel.variableValueMap });
    });
  }, [panel.variableValueMap, triggers, interactionManager]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const p: HTMLParagraphElement | null = ref.current.querySelector('.ProseMirror > p');
    if (!p) {
      return;
    }

    const { offsetWidth, offsetHeight } = p;
    const scaleW = width / offsetWidth;
    const scaleH = height / offsetHeight;
    const scale = Math.min(scaleW, scaleH);
    p.style.transform = `scale(${scale})`;
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
              '&.mantine-RichTextEditor-content .ProseMirror': {
                padding: 0,
                height,
              },
              '&.mantine-RichTextEditor-content .ProseMirror > p': {
                display: 'table',
                margin: '0 auto !important',
                transformOrigin: 'top center',
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
