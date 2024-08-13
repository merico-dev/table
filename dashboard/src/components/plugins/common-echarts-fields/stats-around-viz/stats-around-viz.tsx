import { Box } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { ReadonlyRichText } from '~/components/widgets';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { VizViewContext } from '~/types/plugin';
import { parseRichTextContent } from '~/utils';

type Props = {
  value: string;
  context: VizViewContext;
  onHeightChange?: (v: number) => void;
};
export const StatsAroundViz = observer(({ value, context, onHeightChange }: Props) => {
  const { ref } = useElementSize();
  const contentModel = useRenderContentModelContext();
  const { panel } = useRenderPanelContext();
  const { variables, data } = context;

  const content = useMemo(() => {
    return parseRichTextContent(value, variables, contentModel.payloadForViz, data);
  }, [value, variables, data]);

  const textContentEmpty = ref.current?.textContent === '';
  useEffect(() => {
    if (!onHeightChange || !ref.current) {
      return;
    }
    const h = textContentEmpty ? 0 : ref.current.offsetHeight;
    onHeightChange(h);
  }, [textContentEmpty, ref.current]);

  const display = useMemo(() => {
    return textContentEmpty ? 'none' : 'block';
  }, [textContentEmpty]);

  return (
    <Box sx={{ display }}>
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
