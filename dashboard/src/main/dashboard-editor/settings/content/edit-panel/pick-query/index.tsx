import { Button, Checkbox, Divider, Drawer, Group, Stack, Tabs, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { MultiSelectWidget } from '~/filter/filter-multi-select/render/widget';
import { useContentModelContext, useModelContext, usePanelContext } from '../../../../../../contexts';
import { useState } from 'react';
import { DataPreview } from '../../data-preview';
import { IconLine, IconLink } from '@tabler/icons';

export const PickQuery = observer(function _PickQuery() {
  const model = useModelContext();
  const content = useContentModelContext();
  const { panel } = usePanelContext();
  const [opened, setOpened] = useState(false);

  const navigateToQuery = (queryID: string) => {
    model.editor.setPath(['_QUERIES_', queryID]);
  };

  const isChecked = (queryID: string) => {
    return panel.queryIDSet.has(queryID); // TODO
  };
  const handleCheck = (queryID: string, checked: boolean) => {
    const absent = !panel.queryIDSet.has(queryID);
    if (checked && absent) {
      panel.addQueryID(queryID);
      return;
    }
    if (!checked && !absent) {
      panel.removeQueryID(queryID);
    }
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Choose queries"
        padding="xl"
        size="xl"
        zIndex={320}
      >
        <Checkbox.Group orientation="vertical" value={[...panel.queryIDs]} onChange={panel.setQueryIDs}>
          {content.queries.options.map((o) => (
            <Checkbox key={o.value} label={o.label} value={o.value} />
          ))}
        </Checkbox.Group>
      </Drawer>

      <Stack spacing={6}>
        <Group position="right">
          <Button variant="light" size="sm" leftIcon={<IconLine size={16} />} onClick={() => setOpened(true)}>
            Click me to choose queries for this panel
          </Button>
        </Group>
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
        {panel.queryIDs.length === 1 && <DataPreview id={panel.queryIDs[0]} />}
        {panel.queryIDs.length > 1 && (
          <Tabs defaultValue={panel.queryIDs[0]}>
            <Tabs.List>
              {panel.queries.map((q) => (
                <Tabs.Tab value={q.id}>{q.name}</Tabs.Tab>
              ))}
            </Tabs.List>
            {panel.queries.map((q) => (
              <Tabs.Panel value={q.id}>
                <DataPreview id={q.id} />
              </Tabs.Panel>
            ))}
          </Tabs>
        )}
      </Stack>
    </>
  );
});
