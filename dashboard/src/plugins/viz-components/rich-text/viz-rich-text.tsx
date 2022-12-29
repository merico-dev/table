import { ReadonlyRichText } from '~/panel/settings/common/readonly-rich-text-editor';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { IRichTextConf } from './type';

export function VizRichText({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IRichTextConf>(context.instanceData, 'config');

  if (conf?.content) {
    return (
      <ReadonlyRichText
        value={conf.content}
        styles={{
          root: {
            border: 'none',
          },
          content: {
            padding: 0,
          },
        }}
      />
    );
  }
  return null;
}
