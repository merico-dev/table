import { Button, Group, Select, Text } from '@mantine/core';
import { cast } from 'mobx-state-tree';
import { randomId } from '@mantine/hooks';
import React from 'react';
import { DashboardModelInstance } from '../../model';
import { DataSourceType } from '../../model/queries';
import { observer } from 'mobx-react-lite';

interface ISelectOrAddQuery {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
  model: DashboardModelInstance;
}
export const SelectOrAddQuery = observer(function _SelectOrAddQuery({ id, setID, model }: ISelectOrAddQuery) {
  const chooseDefault = React.useCallback(() => {
    setID(model.queries.firstID ?? '');
  }, [setID, model.queries.firstID]);

  React.useEffect(() => {
    if (!id) {
      chooseDefault();
      return;
    }
    const index = model.queries.current.findIndex((d) => d.id === id);
    if (index === -1) {
      chooseDefault();
    }
  }, [id, model.queries, chooseDefault]);

  const options = React.useMemo(() => {
    return model.queries.current.map((d) => ({
      value: d.id,
      label: d.id,
    }));
  }, [model.queries.current]);

  const add = React.useCallback(() => {
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
  }, [model.queries, setID]);

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
});
