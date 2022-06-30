import { Group, Select, Text } from "@mantine/core";
import React from "react";
import { DefinitionContext, PanelContext } from "../../../contexts";
import { DataPreview } from "../../../definition-editor/query-editor/data-preview";

interface IPickQuery {
}
export function PickQuery({ }: IPickQuery) {
  const { queries } = React.useContext(DefinitionContext);
  const { queryID, setQueryID, data, loading } = React.useContext(PanelContext)

  const options = React.useMemo(() => {
    return queries.map(d => ({
      value: d.id,
      label: d.id,
    }))
  }, [queries]);

  return (
    <Group direction="column" grow noWrap>
      <Group position="left" sx={{ maxWidth: '600px', alignItems: 'baseline' }}>
        <Text>Select a Query</Text>
        <Select
          data={options}
          value={queryID}
          // @ts-expect-error
          onChange={setQueryID}
          allowDeselect={false}
          clearable={false}
          sx={{ flexGrow: 1 }}
        />
      </Group>
      <DataPreview id={queryID} />
    </Group>
  )
}