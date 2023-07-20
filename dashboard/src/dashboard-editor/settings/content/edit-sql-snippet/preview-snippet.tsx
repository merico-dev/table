import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { MinimalMonacoEditor } from '~/form-inputs/minimal-monaco-editor';
import { useContentModelContext } from '~/contexts';
import { explainSQL } from '~/utils/sql';

interface IPreviewSnippet {
  value: string;
}

export const PreviewSnippet = observer(({ value }: IPreviewSnippet) => {
  const content = useContentModelContext();
  const payload = content.payloadForSQL;
  const explained = useMemo(() => {
    return explainSQL(value, payload);
  }, [value, payload]);

  return <MinimalMonacoEditor height="100%" value={explained} />;
});
