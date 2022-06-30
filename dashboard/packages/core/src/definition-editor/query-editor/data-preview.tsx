import { ActionIcon, Group, LoadingOverlay, Table, Text } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { Refresh } from "tabler-icons-react";
import { queryBySQL } from "../../api-caller";
import { ContextInfoContext, DefinitionContext } from "../../contexts";

export function DataPreview({ id }: { id: string }) {
  const definitions = React.useContext(DefinitionContext);
  const contextInfo = React.useContext(ContextInfoContext);

  const query = React.useMemo(() => {
    return definitions.queries.find(d => d.id === id);
  }, [definitions.queries, id]);

  const { data = [], loading, refresh } = useRequest(queryBySQL({
    context: contextInfo,
    definitions,
    title: id,
    query,
  }), {
    refreshDeps: [contextInfo, definitions, query],
  });
  if (loading) {
    return <LoadingOverlay visible={loading} exitTransitionDuration={0} />;
  }
  if (data.length === 0) {
    return <Table></Table>;
  }
  return (
    <Group my="xl" direction="column" grow sx={{ border: '1px solid #eee' }}>
      <Group position="apart" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Group position="left">
          <Text weight={500}>Preview Data</Text>
          {data.length > 10 && (
            <Text size="sm" color="gray">Showing 10 rows of {data.length}</Text>
          )}
        </Group>
        <ActionIcon mr={15} variant="hover" color="blue" disabled={loading} onClick={refresh}>
          <Refresh size={15} />
        </ActionIcon>
      </Group>
      <Table>
        <thead>
          <tr>
            {Object.keys(data?.[0]).map(label => (
              <th key={label}>
                <Text weight={700} color="#000">{label}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((row: Record<string, any>, index: number) => (
            <tr key={`row-${index}`}>
              {Object.values(row).map((v: any, i) => (
                <td key={`${v}--${i}`}>
                  <Group sx={{ '&, .mantine-Text-root': { fontFamily: 'monospace' } }}>
                    <Text>{v}</Text>
                  </Group>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Group>
  )
}