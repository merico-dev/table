import { useRenderContentModelContext } from '~/contexts';
import { VizInstance, VizViewContext } from '~/types/plugin';
import { parseRichTextContent } from '~/utils';
import { notifyVizRendered } from '../viz-components/viz-instance-api';

export function useHandleChartRenderFinished(
  statsConf: { top: string; bottom: string },
  context: VizViewContext,
  instance: VizInstance,
) {
  const contentModel = useRenderContentModelContext();
  function handleChartRenderFinished(chartOptions: unknown) {
    const statsAboveViz = parseRichTextContent(
      statsConf.top,
      context.variables,
      contentModel.payloadForViz,
      context.data,
    );
    const statsBelowViz = parseRichTextContent(
      statsConf.bottom,
      context.variables,
      contentModel.payloadForViz,
      context.data,
    );
    notifyVizRendered(instance, {
      ...(chartOptions as object),
      statsAboveViz,
      statsBelowViz,
    });
  }
  return handleChartRenderFinished;
}
