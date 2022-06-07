import { Group, Select, Text } from "@mantine/core";
import React from "react";
import { DefinitionContext, PanelContext } from "../../../contexts";
import { DataPreview } from "../../../definition-editor/data-source-editor/data-preview";

interface IPickDataSource {
}
export function PickDataSource({ }: IPickDataSource) {
  const { dataSources, setDataSources } = React.useContext(DefinitionContext);
  const { dataSourceID, setDataSourceID, data, loading } = React.useContext(PanelContext)

  const options = React.useMemo(() => {
    return dataSources.map(d => ({
      value: d.id,
      label: d.id,
    }))
  }, [dataSources]);

  return (
    <Group direction="column" grow noWrap>
      <Group position="left" sx={{ maxWidth: '600px', alignItems: 'baseline' }}>
        <Text>Select a Data Source</Text>
        <Select
          data={options}
          value={dataSourceID}
          // @ts-expect-error
          onChange={setDataSourceID}
          allowDeselect={false}
          clearable={false}
          sx={{ flexGrow: 1 }}
        />
      </Group>
      <DataPreview id={dataSourceID} />
    </Group>
  )
}