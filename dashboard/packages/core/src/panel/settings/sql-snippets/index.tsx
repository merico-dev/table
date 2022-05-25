import { Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { DefinitionContext } from "../../../contexts";
import { SQLSnippetsForm } from "./form";

interface ISQLSnippetsTab {
}

export function SQLSnippetsTab({ }: ISQLSnippetsTab) {
  const { sqlSnippets, setSQLSnippets } = React.useContext(DefinitionContext)
  const sampleSQL = `SELECT *\nFROM commit\nWHERE \$\{author_time_condition\}`;

  return (
    <Group direction="column">
      <Prism language="sql" sx={{ width: '100%' }} noCopy colorScheme="dark">
        {`-- You may refer context data *by name*\n-- in SQL or VizConfig.\n\n${sampleSQL}\n\n-- where author_time_condition is:\nauthor_time BETWEEN '\$\{timeRange?.[0].toISOString()\}' AND '\$\{timeRange?.[1].toISOString()\}'\n`}
      </Prism>
      <Text weight={700}>SQL Snippets</Text>
      <SQLSnippetsForm sqlSnippets={sqlSnippets} setSQLSnippets={setSQLSnippets} />
    </Group>
  )
}