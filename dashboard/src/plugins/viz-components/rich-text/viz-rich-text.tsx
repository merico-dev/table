import { defaults } from 'lodash';
import { useMemo } from 'react';
import { ReadonlyRichText } from '~/components/rich-text-editor/readonly-rich-text-editor';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { DEFAULT_CONFIG, IRichTextConf } from './type';
import { templateToString } from '~/utils/template';

export function VizRichText({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IRichTextConf>(context.instanceData, 'config');
  const { variables, data } = context;

  const content = useMemo(() => {
    const conf = defaults({}, confValue, DEFAULT_CONFIG);
    if (!conf.content) {
      return '';
    }
    return templateToString(conf.content, variables, data);
  }, [confValue, variables]);

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
}
