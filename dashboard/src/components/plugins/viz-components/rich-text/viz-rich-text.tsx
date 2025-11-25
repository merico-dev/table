import { defaults } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { ReadonlyRichText } from '~/components/widgets/rich-text-editor/readonly-rich-text-editor';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '~/types/plugin';
import { parseRichTextContent } from '~/utils';
import { ClickRichTextBlock } from './triggers';
import { IClickRichTextBlockConfig } from './triggers/click-rich-text-block';
import { DEFAULT_CONFIG, IRichTextConf } from './type';

export const VizRichText = observer(({ context, instance }: VizViewProps) => {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });
  const triggers = useTriggerSnapshotList<IClickRichTextBlockConfig>(
    interactionManager.triggerManager,
    ClickRichTextBlock.id,
  );
  const contentModel = useRenderContentModelContext();
  const { panel } = useRenderPanelContext();
  const { value: confValue } = useStorageData<IRichTextConf>(context.instanceData, 'config');
  const { variables, data } = context;

  const content = useMemo(() => {
    const conf = defaults({}, confValue, DEFAULT_CONFIG);
    if (!conf.content) {
      return '';
    }
    return parseRichTextContent(conf.content, variables, contentModel.payloadForViz, data);
  }, [data, confValue, variables, contentModel.payloadForViz]);

  if (!content) {
    return null;
  }

  function handleClick(ev: React.MouseEvent) {
    // implement the interaction block click handler with event delegation
    const target = ev.target as HTMLElement;
    const interactionBlock = target.closest('[data-interaction-block-id]') as HTMLElement;

    const payload = { variables: panel.variableValueMap };

    if (interactionBlock) {
      const blockId = interactionBlock.getAttribute('data-interaction-block-id');

      // Find triggers that match this blockId
      const matchingTriggers = triggers.filter((t) => {
        return t.config?.blockId === blockId;
      });

      // Run matching triggers
      matchingTriggers.forEach((t) => {
        void interactionManager.runInteraction(t.id, payload);
      });

      // If there are matching triggers, prevent default and stop propagation
      if (matchingTriggers.length > 0) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    } else {
      // Run triggers without blockId (global click handlers)
      const globalTriggers = triggers.filter((t) => {
        return !t.config?.blockId;
      });

      globalTriggers.forEach((t) => {
        void interactionManager.runInteraction(t.id, payload);
      });
    }
  }

  return (
    <div onClick={handleClick}>
      <ReadonlyRichText
        value={content}
        styles={{
          root: {
            border: 'none',
            height: '100%',
          },
          content: {
            padding: 0,
          },
        }}
        dashboardStateValues={contentModel.dashboardStateValues}
        variableAggValueMap={panel.variableAggValueMap}
      />
    </div>
  );
});
