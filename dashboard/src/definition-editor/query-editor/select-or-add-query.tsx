import { Button, Group, Select, Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import React from 'react';
import { DefinitionContext } from '../../contexts';
import { DataSourceType, QueryModelInstance } from '../../model/queries';

interface ISelectOrAddQuery {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
}
export function SelectOrAddQuery({ id, setID }: ISelectOrAddQuery) {
  const { queries, setQueries } = React.useContext(DefinitionContext);

  const chooseDefault = React.useCallback(() => {
    setID(queries[0]?.id ?? '');
  }, [setID, queries]);

  React.useEffect(() => {
    if (!id) {
      chooseDefault();
      return;
    }
    const index = queries.findIndex((d) => d.id === id);
    if (index === -1) {
      chooseDefault();
    }
  }, [id, queries, chooseDefault]);

  const options = React.useMemo(() => {
    return queries.map((d) => ({
      value: d.id,
      label: d.id,
    }));
  }, [queries]);

  const add = React.useCallback(() => {
    const newQuery: QueryModelInstance = {
      id: randomId(),
      type: DataSourceType.Postgresql,
      key: '',
      sql: '',
    };

    setQueries((prevs) => [...prevs, newQuery]);
    setID(newQuery.id);
  }, [setQueries, setID]);

  return (
    <Group pb="xl">
      <Group position="left" sx={{ maxWidth: '600px', alignItems: 'baseline' }}>
        <Text>Select a Query</Text>
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
          <Button onClick={add}>Add a Query</Button>
        </Group>
      </Group>
    </Group>
  );
}
