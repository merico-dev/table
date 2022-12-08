import { Group, Select, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useModelContext, usePanelContext } from '../../../contexts';
import { DataPreview } from '../../../definition-editor/query-editor/data-preview';

export const PickQuery = observer(function _PickQuery() {
  const model = useModelContext();
  const {
    panel: { queryID, setQueryID },
  } = usePanelContext();

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
          onChange={setQueryID}
          allowDeselect={false}
          clearable={false}
          // @ts-expect-error important
          sx={{ flexGrow: '1 !important' }}
        />
      </Group>
      <DataPreview id={queryID} />
    </Stack>
  );
});
