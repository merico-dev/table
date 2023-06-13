// TODO: new UI

import { ActionIcon, Group, Select, Stack, Text, Tooltip } from '@mantine/core';
import { IconArrowCurveRight } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useContentModelContext, useModelContext, usePanelContext } from '../../../../../../contexts';
import { DataPreview } from '../../data-preview';
import { FilterMultiSelect } from '~/filter/filter-multi-select/render';
import { MultiSelectWidget } from '~/filter/filter-multi-select/render/widget';

export const PickQuery = observer(function _PickQuery() {
  const model = useModelContext();
  const content = useContentModelContext();
  const {
    panel: { queryIDs, setQueryIDs },
  } = usePanelContext();

  const navigateToQuery = (queryID: string) => {
    model.editor.setPath(['_QUERIES_', queryID]);
  };

  return (
    <Stack>
      <Group position="left" sx={{ maxWidth: '600px', alignItems: 'baseline' }}>
        <Text>Use query</Text>
        <MultiSelectWidget
          label={''}
          options={content.queries.options}
          value={queryIDs}
          onChange={setQueryIDs}
          disabled={false}
        />
        {/* <Select
          data={content.queries.options}
          value={queryID}
          onChange={setQueryID}
          allowDeselect={false}
          clearable={false}

          // @ts-expect-error important
          sx={{ flexGrow: '1 !important' }}
          maxDropdownHeight={300}
          rightSection={
            queryID && (
              <Tooltip label="Open this query">
                <ActionIcon variant="subtle" color="blue" onClick={navigateToQuery}>
                  <IconArrowCurveRight size={16} />
                </ActionIcon>
              </Tooltip>
            )
          }
        /> */}
      </Group>
      {/* <DataPreview id={queryID} /> */}
    </Stack>
  );
});
