import { Group, LoadingOverlay, Table, Text } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { queryBySQL } from "../../api-caller";
import { ContextInfoContext, DefinitionContext } from "../../contexts";

export function DataPreview({ id }: { id: string }) {
  const definitions = React.useContext(DefinitionContext);
  const contextInfo = React.useContext(ContextInfoContext);

  const dataSource = React.useMemo(() => {
    return definitions.dataSources.find(d => d.id === id);
  }, [definitions.dataSources, id]);

  const { data = [], loading } = useRequest(queryBySQL({
    context: contextInfo,
    definitions,
    title: id,
    dataSource,
  }), {
    refreshDeps: [contextInfo, definitions, dataSource],
  });
  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }
  if (data.length === 0) {
    return <Table></Table>;
  }
  return (
    <Group my="xl" direction="column" grow sx={{ border: '1px solid #eee' }}>
      <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Text weight={500}>Preview Data</Text>
      </Group>
      <Table>
        <thead>
          <tr>
            {Object.keys(data?.[0]).map(label => <th key={label}>{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row: Record<string, any>, index: number) => (
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