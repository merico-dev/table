import { CodeHighlight } from '@mantine/code-highlight';
import { Alert, Stack, Tabs } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { IconAlertCircle, IconVariable, IconVariablePlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { GlobalSQLSnippetsTable } from './global-sql-snippets-table';

interface IQueryVariablesGuide {
  showSQLSnippets?: boolean;
  sx?: EmotionSx;
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
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
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
            {t('query_variable.guide.tabs.guide')}
          </Tabs.Tab>
          <Tabs.Tab value="local_query_vars" icon={<IconVariable size={14} />}>
            {t('query_variable.guide.tabs.variables_in_this_dashboard')}
          </Tabs.Tab>
          <Tabs.Tab value="global_sql_snippets" icon={<IconVariablePlus size={14} />}>
            {t('query_variable.guide.tabs.global_sql_snippets')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="guide" pt="xs">
          <CodeHighlight language="sql" sx={{ width: '100%' }} withCopyButton={false} code={example} />
        </Tabs.Panel>

        <Tabs.Panel value="local_query_vars" pt="xs">
          <CodeHighlight language="json" sx={{ width: '100%' }} withCopyButton={false} code={variablesString} />
        </Tabs.Panel>

        <Tabs.Panel value="global_sql_snippets" pt="xs">
          <Stack gap={10}>
            <Alert icon={<IconAlertCircle size={16} />} title={t('global_sql_snippet.labels')}>
              {t('global_sql_snippet.description')}
            </Alert>
            <GlobalSQLSnippetsTable />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
