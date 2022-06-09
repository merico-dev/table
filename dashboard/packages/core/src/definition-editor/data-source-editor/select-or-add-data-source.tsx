import { Button, Group, Select, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import React from "react";
import { DefinitionContext } from "../../contexts";
import { IDataSource } from "../../types";

interface ISelectOrAddDataSource {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
}
export function SelectOrAddDataSource({ id, setID }: ISelectOrAddDataSource) {
  const { dataSources, setDataSources } = React.useContext(DefinitionContext);

  const chooseDefault = React.useCallback(() => {
    setID(dataSources[0]?.id ?? '');
  }, [setID, dataSources]);

  React.useEffect(() => {
    if (!id) {
      chooseDefault()
      return;
    }
    const index = dataSources.findIndex(d => d.id === id);
    if (index === -1) {
      chooseDefault()
    }
  }, [id, dataSources, chooseDefault])

  const options = React.useMemo(() => {
    return dataSources.map(d => ({
      value: d.id,
      label: d.id,
    }))
  }, [dataSources]);

  const add = React.useCallback(() => {
    const newDataSource: IDataSource = {
      id: randomId(),
      type: 'postgresql',
      key: '',
      sql: '',
    };

    setDataSources(prevs => ([ ...prevs, newDataSource ]))
    setID(newDataSource.id)
  }, [setDataSources, setID])

  return (
    <Group pb="xl">
      <Group position="left" sx={{ maxWidth: '600px', alignItems: 'baseline' }}>
        <Text>Select a Data Source</Text>
        <Select
          data={options}
          value={id}
          // @ts-expect-error
          onChange={setID}
          allowDeselect={false}
          clearable={false}
          sx={{ flexGrow: 1 }}
        />
        <Text>or</Text>
        <Group position="center" mt="md">
          <Button onClick={add}>
            Add a Data Source
          </Button>
        </Group>
      </Group>
    </Group>
  )
}