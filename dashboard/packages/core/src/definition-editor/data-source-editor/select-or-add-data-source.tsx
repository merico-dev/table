import { Button, Group, Select, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import React from "react";
import { DefinitionContext } from "../../contexts";

interface ISelectOrAddDataSource {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
}
export function SelectOrAddDataSource({ id, setID }: ISelectOrAddDataSource) {
  const { dataSources, setDataSources } = React.useContext(DefinitionContext);

  React.useEffect(() => {
    if (!id) {
      setID(dataSources[0]?.id ?? '');
    }
  }, [id, setID, dataSources])

  const options = React.useMemo(() => {
    return dataSources.map(d => ({
      value: d.id,
      label: d.id,
    }))
  }, [dataSources]);

  const add = React.useCallback(() => {
    setDataSources!.append({
      id: randomId(),
      type: 'postgresql',
      key: '',
      sql: '',
    })
  }, [setDataSources])

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