import { Prism } from '@mantine/prism';
import React from 'react';
import { ModelContext } from '../../contexts/model-context';
import { explainSQL } from '../../utils/sql';

interface IPreviewSQL {
  value: string;
}
export function PreviewSQL({ value }: IPreviewSQL) {
  const { model } = React.useContext(ModelContext);
  const context = model.context.current;

  const explained = React.useMemo(() => {
    return explainSQL(value, context, model.sqlSnippets.current, model.filters.values);
  }, [value, context, model.sqlSnippets.current, model.filters.values]);
  return (
    <Prism language="sql" colorScheme="light">
      {explained}
    </Prism>
  );
}
