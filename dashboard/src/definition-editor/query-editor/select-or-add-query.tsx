import { Button, Group, Select, Text } from '@mantine/core';
import { cast } from 'mobx-state-tree';
import { randomId } from '@mantine/hooks';
import React from 'react';
import { DataSourceType } from '../../model/queries/types';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '../../contexts';

interface ISelectOrAddQuery {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
}
export const SelectOrAddQuery = observer(function _SelectOrAddQuery({ id, setID }: ISelectOrAddQuery) {
  const model = useModelContext();
  const chooseDefault = () => {
    setID(model.queries.firstID ?? '');
  };

  React.useEffect(() => {
    if (!id) {
      chooseDefault();
      return;
    }
    const index = model.queries.current.findIndex((d) => d.id === id);
    if (index === -1) {
      chooseDefault();
    }
  }, [id, model.queries.current, chooseDefault]);

  const add = () => {
    const id = randomId();
    model.queries.append(
      cast({
        id,
        name: id,
        type: DataSourceType.Postgresql,
        key: '',
        sql: '',
      }),
    );

    setID(id);
  };

  return (
    <Group grow sx={{ width: '100%' }}>
      <Group position="left" sx={{ flexGrow: 1, alignItems: 'baseline' }}>
        <Text>Select a Query</Text>
        <Select
          data={model.queries.options}
          value={id}
          // @ts-expect-error type mismatch
          onChange={setID}
          allowDeselect={false}
          clearable={false}
          sx={{ flexGrow: 1, maxWidth: '500px' }}
        />
        <Text>or</Text>
        <Group position="center" mt="md">
          <Button onClick={add}>Add a Query</Button>
        </Group>
      </Group>
    </Group>
  );
});
