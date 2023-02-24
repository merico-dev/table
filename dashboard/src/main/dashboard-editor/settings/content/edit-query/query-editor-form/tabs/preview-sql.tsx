import { observer } from 'mobx-react-lite';
import React from 'react';
import { PreviewSQLInMonacoEditor } from '~/definition-editor/preview-sql-in-monaco-editor';
import { useModelContext } from '../../../../../../../contexts/model-context';
import { explainSQL } from '../../../../../../../utils/sql';

interface IPreviewSQL {
  value: string;
}
export const PreviewSQL = observer(({ value }: IPreviewSQL) => {
  const model = useModelContext();
  const context = model.context.current;

  const explained = React.useMemo(() => {
    return explainSQL(value, context, model.mock_context.current, model.sqlSnippets.current, model.filters.values);
  }, [value, context, model.mock_context.current, model.sqlSnippets.current, model.filters.values]);
  return <PreviewSQLInMonacoEditor height="100%" value={explained} />;
});
