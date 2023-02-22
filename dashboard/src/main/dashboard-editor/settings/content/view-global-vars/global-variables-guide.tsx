import { Group, Stack, Sx, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useModelContext } from '../../../../../contexts/model-context';

interface IGlobalVariablesGuide {
  showSQLSnippets?: boolean;
  sx?: Sx;
}

const example = `
-- You may reference global variables in SQL or VizConfig.
SELECT *
FROM commit
WHERE
  -- context
  user_id IS '\$\{context.currentUserID\}'
  -- filters
  author_time BETWEEN '\$\{filters.timeRange?.[0].toISOString()\}' AND '\$\{filters.timeRange?.[1].toISOString()\}'
  -- SQL snippets
  AND \$\{sql_snippets.author_email_condition\}
  \$\{sql_snippets.order_by_clause\}
`;
export const GlobalVariablesGuide = observer(function _GlobalVariablesGuide({
  showSQLSnippets = true,
  sx = {},
}: IGlobalVariablesGuide) {
  const model = useModelContext();
  const contextInfo = model.context.current;

  const variablesString = (() => {
    const ret: Record<string, $TSFixMe> = {
      context: {
        ...model.mock_context.current,
        ...contextInfo,
      },
      filters: model.filters.previewValues,
    };

    if (showSQLSnippets) {
      ret.sql_snippets = model.sqlSnippets.record;
    }

    return JSON.stringify(ret, null, 2);
  })();

  return (
    <Stack
      sx={{
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Stack sx={{ width: '100%' }}>
        <Text weight={500} sx={{ flexGrow: 0 }}>
          Guide
        </Text>
        <Prism language="sql" sx={{ width: '100%' }} noCopy colorScheme="dark">
          {example}
        </Prism>
        <Text weight={500} sx={{ flexGrow: 0 }}>
          Current Values
        </Text>
        <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">
          {variablesString}
        </Prism>
      </Stack>
    </Stack>
  );
});
