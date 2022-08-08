import { Prism } from '@mantine/prism';
import React from 'react';
import { ContextInfoContext, DefinitionContext, FilterValuesContext } from '../../contexts';
import { explainSQL } from '../../utils/sql';

interface IPreviewSQL {
  value: string;
}
export function PreviewSQL({ value }: IPreviewSQL) {
  const context = React.useContext(ContextInfoContext);
  const filterValues = React.useContext(FilterValuesContext);
  const definition = React.useContext(DefinitionContext);

  const explained = React.useMemo(() => {
    return explainSQL(value, context, definition, filterValues);
  }, [value, context, definition, filterValues]);
  return (
    <Prism language="sql" colorScheme="light">
      {explained}
    </Prism>
  );
}
