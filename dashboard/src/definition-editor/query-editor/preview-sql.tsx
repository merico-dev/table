import { Prism } from '@mantine/prism';
import React from 'react';
import { ContextInfoContext, FilterValuesContext } from '../../contexts';
import { ModelContext } from '../../contexts/model-context';
import { explainSQL } from '../../utils/sql';

interface IPreviewSQL {
  value: string;
}
export function PreviewSQL({ value }: IPreviewSQL) {
  const context = React.useContext(ContextInfoContext);
  const filterValues = React.useContext(FilterValuesContext);
  const { model } = React.useContext(ModelContext);

  const explained = React.useMemo(() => {
    return explainSQL(value, context, model.sqlSnippets.current, filterValues);
  }, [value, context, model.sqlSnippets.current, filterValues]);
  return (
    <Prism language="sql" colorScheme="light">
      {explained}
    </Prism>
  );
}
