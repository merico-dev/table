import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContentModelContext } from '~/contexts';
import { explainSQL } from '~/utils/sql';
import { PreviewSQLInMonacoEditor } from './preview-sql-in-monaco-editor';

interface IPreviewSQL {
  value: string;
}
export const PreviewSQL = observer(({ value }: IPreviewSQL) => {
  const content = useContentModelContext();
  const payload = content.payloadForSQL;

  const explained = React.useMemo(() => {
    const { context, mock_context, sqlSnippets, filterValues } = payload;
    return explainSQL(value, context, mock_context, sqlSnippets, filterValues);
  }, [value, payload]);
  return <PreviewSQLInMonacoEditor height="100%" value={explained} />;
});
