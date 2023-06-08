import { Alert, Stack, Sx, Tabs, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import {
  IconAlertCircle,
  IconInfoCircle,
  IconInfoSquare,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
  IconVariable,
  IconVariablePlus,
} from '@tabler/icons';
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
  repo_id IS '\$\{context.root_repo_id\}'
  -- filters
  author_time BETWEEN '\$\{filters.timeRange?.[0].toISOString()\}' AND '\$\{filters.timeRange?.[1].toISOString()\}'
  -- SQL snippets
  AND \$\{sql_snippets.author_email_condition\}
  -- Global SQL snippets (shared between dashboards)
  AND \$\{global_sql_snippets.account_condition\}
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
      <Tabs defaultValue="guide" keepMounted={false}>
        <Tabs.List grow>
          <Tabs.Tab value="guide" icon={<IconAlertCircle size={14} />}>
            Guide
          </Tabs.Tab>
          <Tabs.Tab value="local_query_vars" icon={<IconVariable size={14} />}>
            Variables in this dashboard
          </Tabs.Tab>
          <Tabs.Tab value="global_sql_snippets" icon={<IconVariablePlus size={14} />}>
            Global SQL Snippets
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="guide" pt="xs">
          <Prism language="sql" sx={{ width: '100%' }} noCopy colorScheme="dark">
            {example}
          </Prism>
        </Tabs.Panel>

        <Tabs.Panel value="local_query_vars" pt="xs">
          <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">
            {variablesString}
          </Prism>
        </Tabs.Panel>

        <Tabs.Panel value="global_sql_snippets" pt="xs">
          <Stack spacing={10}>
            <Alert icon={<IconAlertCircle size={16} />} title="Global SQL Snippets">
              SQL snippets worth sharing between dashboards are managed in System Settings by admins.
            </Alert>
            <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">
              {'{}'}
            </Prism>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
