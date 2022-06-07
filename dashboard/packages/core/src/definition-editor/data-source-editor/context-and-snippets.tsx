import { Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { DefinitionContext } from "../../contexts";
import { ContextInfoContext } from "../../contexts/context-info-context";

interface IContextAndSnippets {
}

const example = `
-- You may reference context data or SQL snippets *by name*
-- in SQL or VizConfig.
SELECT *
FROM commit
WHERE
  -- context data
  author_time BETWEEN '\$\{timeRange?.[0].toISOString()\}' AND '\$\{timeRange?.[1].toISOString()\}'
  -- SQL snippets
  AND \$\{author_email_condition\}
  \$\{order_by_clause\}
`
export function ContextAndSnippets({ }: IContextAndSnippets) {
  const contextInfo = React.useContext(ContextInfoContext)
  const { sqlSnippets } = React.useContext(DefinitionContext)

  const snippets = React.useMemo(() => {
    const snippets = sqlSnippets.reduce((prev, curr) => {
      prev[curr.key] = curr.value;
      return prev;
    }, {} as Record<string, string>)
    return JSON.stringify(snippets, null, 2);
  }, [sqlSnippets]);

  const context = React.useMemo(() => {
    return JSON.stringify(contextInfo, null, 2);
  }, [contextInfo]);

  return (
    <Group direction="column" grow sx={{ border: '1px solid #eee', maxWidth: '48%', overflow: 'hidden' }}>
      <Group position="left" pl="md" py="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}>
        <Text weight={500}>Context</Text>
      </Group>
      <Group direction="column" px="md" pb="md" sx={{ width: '100%' }}>
        <Prism language="sql" sx={{ width: '100%' }} noCopy colorScheme="dark">
          {example}
        </Prism>
        <Text weight={500} sx={{ flexGrow: 0 }}>Avaiable context</Text>
        <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">{context}</Prism>
        <Text weight={500} sx={{ flexGrow: 0 }}>Avaiable SQL Snippets</Text>
        <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">{snippets}</Prism>
      </Group>
    </Group>
  )
}