import { Stack, Sx, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import { useContentModelContext, useModelContext } from '~/contexts';

interface IQueryVariablesGuide {
  showSQLSnippets?: boolean;
  sx?: Sx;
}

const example = `
-- You may reference query variables in SQL or VizConfig.
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
export const QueryVariablesGuide = observer(function _QueryVariablesGuide({
  showSQLSnippets = true,
  sx = {},
}: IQueryVariablesGuide) {
  const model = useModelContext();
  const content = useContentModelContext();
  const contextInfo = model.context.current;

  const variablesString = (() => {
    const ret: Record<string, $TSFixMe> = {
      context: {
        ...content.mock_context.current,
        ...contextInfo,
      },
      filters: content.filters.previewValues,
    };

    if (showSQLSnippets) {
      ret.sql_snippets = content.sqlSnippets.record;
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
