import { Group, Select, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useModelContext, PanelContext } from '../../../contexts';
import { DataPreview } from '../../../definition-editor/query-editor/data-preview';

interface IPickQuery {}
export const PickQuery = observer(function _PickQuery({}: IPickQuery) {
  const model = useModelContext();
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
          // @ts-expect-error type mismatch
          onChange={setQueryID}
          allowDeselect={false}
          clearable={false}
          sx={{ flexGrow: 1 }}
        />
      </Group>
      <DataPreview id={queryID} />
    </Stack>
  );
});
