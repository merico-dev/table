import { defaults } from 'lodash';
import { useMemo } from 'react';
import { ReadonlyRichText } from '~/panel/settings/common/readonly-rich-text-editor';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { DEFAULT_CONFIG, IRichTextConf } from './type';

export function VizRichText({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IRichTextConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);

  if (!conf?.content) {
    return null;
  }

  return (
    <ReadonlyRichText
      value={conf.content}
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
