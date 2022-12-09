import { observer } from 'mobx-react-lite';
import { useModelContext } from '../../contexts/model-context';
import { explainSQLSnippet } from '../../utils/sql';
import { MinimalMonacoEditor } from '../minimal-monaco-editor';

interface IPreviewSnippet {
  value: string;
}

export const PreviewSnippet = observer(({ value }: IPreviewSnippet) => {
  const model = useModelContext();
  const context = model.context.current;
  const explained = explainSQLSnippet(value, context, model.mock_context.current, model.filters.values);

  return <MinimalMonacoEditor height="400px" value={explained} />;
});
