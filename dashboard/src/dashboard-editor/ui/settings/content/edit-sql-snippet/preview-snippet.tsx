import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { MinimalMonacoEditor } from '~/components/widgets/minimal-monaco-editor';
import { useRenderContentModelContext } from '~/contexts';
import { explainSQL } from '~/utils';

interface IPreviewSnippet {
  value: string;
}

export const PreviewSnippet = observer(({ value }: IPreviewSnippet) => {
  const content = useRenderContentModelContext();
  const payload = content.payloadForSQL;
  const explained = useMemo(() => {
    return explainSQL(value, payload);
  }, [value, payload]);

  return <MinimalMonacoEditor height="100%" value={explained} />;
});
