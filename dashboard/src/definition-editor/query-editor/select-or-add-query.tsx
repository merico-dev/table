import { Button, Group, Select, Text } from '@mantine/core';
import { cast } from 'mobx-state-tree';
import { randomId } from '@mantine/hooks';
import React from 'react';
import { DataSourceType } from '../../model/queries';
import { observer } from 'mobx-react-lite';
import { ModelContext } from '../../contexts';

interface ISelectOrAddQuery {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
}
export const SelectOrAddQuery = observer(function _SelectOrAddQuery({ id, setID }: ISelectOrAddQuery) {
  const { model } = React.useContext(ModelContext);
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
        type: DataSourceType.Postgresql,
        key: '',
        sql: '',
      }),
    );

    setID(id);
  };

  return (
    <Group pb="xl">
      <Group position="left" sx={{ maxWidth: '600px', alignItems: 'baseline' }}>
        <Text>Select a Query</Text>
        <Select
          data={model.queries.options}
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
});
