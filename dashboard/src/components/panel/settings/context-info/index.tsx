import { Code, Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import ContextInfoContext from "../../../../contexts/context-info-context";

interface IContextInfo {
}

export function ContextInfo({ }: IContextInfo) {
  const contextInfo = React.useContext(ContextInfoContext)
  const sampleSQL = React.useMemo(() => {
    const name = Object.keys(contextInfo)[0] ?? 'timeRange[0]';
    if (Array.isArray(contextInfo[name])) {
      return `SELECT *\nFROM data\nWHERE foo IN (\$\{${name}\})`;
    }
    return `SELECT *\nFROM data\nWHERE foo = \$\{${name}\}`
  }, [contextInfo]);

  return (
    <Group direction="column">
      <Prism language="sql" sx={{ width: '100%' }} noCopy colorScheme="dark">
        {`-- You may refer context data *by name*\n-- in SQL or VizConfig.\n\n${sampleSQL}`}
      </Prism>
      <Text weight={700}>Avaiable context entries</Text>
      <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">{JSON.stringify(contextInfo, null, 2)}</Prism>
    </Group>
  )
}