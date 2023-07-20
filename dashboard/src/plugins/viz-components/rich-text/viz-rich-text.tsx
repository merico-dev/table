import { defaults } from 'lodash';
import { useMemo } from 'react';
import { ReadonlyRichText } from '~/form-inputs/rich-text-editor/readonly-rich-text-editor';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { DEFAULT_CONFIG, IRichTextConf } from './type';
import { parseRichTextContent } from './parse-rich-text-content';
import { observer } from 'mobx-react-lite';
import { useContentModelContext, useModelContext } from '~/contexts';

export const VizRichText = observer(({ context }: VizViewProps) => {
  const contentModel = useContentModelContext();
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
    />
  );
});
