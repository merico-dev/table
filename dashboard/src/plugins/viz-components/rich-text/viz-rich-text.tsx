import { RichTextEditor } from '@mantine/rte';
import { noop } from 'lodash';
import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { useSyncEditorContent } from './hooks';
import { IRichTextConf } from './type';
import { usePanelContext } from '~/contexts';

export function VizRichText({ context }: VizViewProps) {
  const { panel } = usePanelContext();
  const { value: conf } = useStorageData<IRichTextConf>(context.instanceData, 'config');
  const content = conf?.content;
  const editorRef = useSyncEditorContent(content);

  if (conf?.content) {
    return (
      <RichTextEditor
        id={panel.id}
        ref={editorRef}
        readOnly
        value={conf.content}
        onChange={noop}
        sx={{
          border: 'none',
          '.ql-editor': {
            padding: 0,
            'h1, h2, h3, h4, h5, p, ul, ol': {
              '&:last-child': {
                marginBottom: 0,
              },
            },
          },
        }}
      />
    );
  }
  return null;
}
