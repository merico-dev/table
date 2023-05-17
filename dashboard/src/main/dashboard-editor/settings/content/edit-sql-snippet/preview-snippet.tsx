import { observer } from 'mobx-react-lite';
import { MinimalMonacoEditor } from '~/components/minimal-monaco-editor';
import { useContentModelContext } from '~/contexts';
import { explainSQLSnippet } from '~/utils/sql';

interface IPreviewSnippet {
  value: string;
}

export const PreviewSnippet = observer(({ value }: IPreviewSnippet) => {
  const content = useContentModelContext();
  const { context, mock_context, filterValues } = content.payloadForSQL;
  const explained = explainSQLSnippet(value, context, mock_context, filterValues);

  return <MinimalMonacoEditor height="100%" value={explained} />;
});
