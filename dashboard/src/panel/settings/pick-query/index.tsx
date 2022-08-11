import { Group, Select, Stack, Text } from '@mantine/core';
import React from 'react';
import { DefinitionContext, PanelContext } from '../../../contexts';
import { DataPreview } from '../../../definition-editor/query-editor/data-preview';
import { DashboardModelInstance } from '../../../model';

interface IPickQuery {
  model: DashboardModelInstance;
}
export function PickQuery({ model }: IPickQuery) {
  const { queryID, setQueryID } = React.useContext(PanelContext);

  const options = React.useMemo(() => {
    return model.queries.current.map((d) => ({
      value: d.id,
      label: d.id,
    }));
  }, [model.queries.current]);

  return (
    <Stack>
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
      <DataPreview id={queryID} model={model} />
    </Stack>
  );
}
