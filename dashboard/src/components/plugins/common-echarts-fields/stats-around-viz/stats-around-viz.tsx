import { Box } from '@mantine/core';
import { forwardRef, useMemo, useRef } from 'react';
import { ReadonlyRichText } from '~/components/widgets';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { VizViewContext } from '~/types/plugin';
import { parseRichTextContent } from '~/utils';

type Props = {
  value: string;
  context: VizViewContext;
};
export const StatsAroundViz = forwardRef<HTMLDivElement, Props>(({ value, context }, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentModel = useRenderContentModelContext();
  const { panel } = useRenderPanelContext();
  const { variables, data } = context;

  const content = useMemo(() => {
    return parseRichTextContent(value, variables, contentModel.payloadForViz, data);
  }, [value, variables, data]);

  const display = rootRef.current?.textContent === '' ? 'none' : 'block';
  return (
    <Box sx={{ display }} ref={rootRef}>
      <ReadonlyRichText
        ref={ref}
        value={content}
        styles={{
          root: {
            border: 'none',
            maxWidth: '100%',
            '&.mantine-RichTextEditor-root': {
              overflow: 'auto !important',
            },
          },
          content: {
            '&.mantine-RichTextEditor-content .ProseMirror': {
              padding: 0,
            },
            '&.mantine-RichTextEditor-content .ProseMirror > p': {
              fontSize: '12px',
              lineHeight: '20px',
            },
          },
        }}
        dashboardState={contentModel.dashboardState}
        variableAggValueMap={panel.variableAggValueMap}
      />
    </Box>
  );
});
