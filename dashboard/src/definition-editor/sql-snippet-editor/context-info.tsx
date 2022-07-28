import { Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { FilterValuesContext } from "../../contexts";
import { ContextInfoContext } from "../../contexts/context-info-context";

interface IContextInfo {
}

export function ContextInfo({ }: IContextInfo) {
  const contextInfo = React.useContext(ContextInfoContext)
  const filterValues = React.useContext(FilterValuesContext)
  const sampleSQL = `SELECT *\nFROM commit\nWHERE author_time BETWEEN '\$\{timeRange?.[0].toISOString()\}' AND '\$\{timeRange?.[1].toISOString()\}'`;

  return (
    <Group direction="column" grow sx={{ border: '1px solid #eee', overflow: 'hidden' }}>
      <Group position="left" pl="md" py="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}>
        <Text weight={500}>Context</Text>
      </Group>
      <Group direction="column" px="md" pb="md" sx={{ width: '100%' }}>
        <Prism language="sql" sx={{ width: '100%' }} noCopy colorScheme="dark">
          {`-- You may refer context data *by name*\n-- in SQL or VizConfig.\n\n${sampleSQL}`}
        </Prism>
        <Text weight={500} sx={{ flexGrow: 0 }}>Available context entries</Text>
        <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">{JSON.stringify(contextInfo, null, 2)}</Prism>

        <Text weight={500} sx={{ flexGrow: 0 }}>Available filter values</Text>
        <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">{JSON.stringify(filterValues, null, 2)}</Prism>
      </Group>
    </Group>
  )
}