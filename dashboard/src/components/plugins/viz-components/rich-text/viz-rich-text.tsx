import { defaults } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { ReadonlyRichText } from '~/components/widgets/rich-text-editor/readonly-rich-text-editor';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { VizViewProps } from '~/types/plugin';
import { parseRichTextContent } from './parse-rich-text-content';
import { DEFAULT_CONFIG, IRichTextConf } from './type';

export const VizRichText = observer(({ context }: VizViewProps) => {
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
  }, [confValue, variables, contentModel.payloadForViz]);

  if (!content) {
    return null;
  }

  return (
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
      dashboardState={contentModel.dashboardState}
      varaiables={panel.variableValueMap}
    />
  );
});
