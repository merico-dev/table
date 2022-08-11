import { Prism } from '@mantine/prism';
import React from 'react';
import { ContextInfoContext, DefinitionContext, FilterValuesContext } from '../../contexts';
import { DashboardModelInstance } from '../../model';
import { explainSQL } from '../../utils/sql';

interface IPreviewSQL {
  value: string;
}
export function PreviewSQL({ value }: IPreviewSQL) {
  const context = React.useContext(ContextInfoContext);
  const filterValues = React.useContext(FilterValuesContext);
  const { sqlSnippets } = React.useContext(DefinitionContext);

  const explained = React.useMemo(() => {
    return explainSQL(value, context, sqlSnippets, filterValues);
  }, [value, context, sqlSnippets, filterValues]);
  return (
    <Prism language="sql" colorScheme="light">
      {explained}
    </Prism>
  );
}
