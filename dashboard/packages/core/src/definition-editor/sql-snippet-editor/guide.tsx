import { Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";

const sampleSQL = `SELECT *\nFROM commit\nWHERE \$\{author_time_condition\}`;

export function SQLSnippetGuide() {
  return (
    <Group direction="column" grow sx={{ border: '1px solid #eee', overflow: 'hidden' }}>
      <Group position="left" pl="md" py="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}>
        <Text weight={500}>Guide</Text>
      </Group>
      <Group direction="column" px="md" pb="md" sx={{ width: '100%' }}>
        <Prism language="sql" sx={{ width: '100%' }} noCopy trim={false} colorScheme="dark">
          {`-- You may refer context data *by name*\n-- in SQL or VizConfig.\n\n${sampleSQL}\n\n-- where author_time_condition is:\nauthor_time BETWEEN '\$\{timeRange?.[0].toISOString()\}' AND '\$\{timeRange?.[1].toISOString()\}'\n `}
        </Prism>
      </Group>
    </Group>
  )
}