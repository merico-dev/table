import { Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { DefinitionContext, FilterValuesContext } from "../contexts";
import { ContextInfoContext } from "../contexts/context-info-context";

interface IGlobalVariablesGuide {
  showSQLSnippets?: boolean;
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
`
export function GlobalVariablesGuide({ showSQLSnippets = true }: IGlobalVariablesGuide) {
  const contextInfo = React.useContext(ContextInfoContext)
  const filterValues = React.useContext(FilterValuesContext)
  const { sqlSnippets } = React.useContext(DefinitionContext)

  const variablesString = React.useMemo(() => {
    const ret: Record<string, any> = {
      context: contextInfo,
      filters: filterValues,
    };

    if (showSQLSnippets) {
      const sql_snippets = sqlSnippets.reduce((prev, curr) => {
        prev[curr.key] = curr.value;
        return prev;
      }, {} as Record<string, string>)
      ret.sql_snippets = sql_snippets;
    }

    return JSON.stringify(ret, null, 2)
  }, [contextInfo, sqlSnippets, filterValues, showSQLSnippets])

  return (
    <Group direction="column" grow sx={{ border: '1px solid #eee', maxWidth: '40%', overflow: 'hidden' }}>
      <Group position="left" pl="md" py="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}>
        <Text weight={500}>Global Variables</Text>
      </Group>
      <Group direction="column" px="md" pb="md" sx={{ width: '100%' }}>
        <Prism language="sql" sx={{ width: '100%' }} noCopy colorScheme="dark">
          {example}
        </Prism>
        <Text weight={500} sx={{ flexGrow: 0 }}>Current Values</Text>
        <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">{variablesString}</Prism>
      </Group>
    </Group>
  )
}