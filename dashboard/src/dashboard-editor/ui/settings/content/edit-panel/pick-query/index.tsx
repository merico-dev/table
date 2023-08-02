import { ActionIcon, Button, Checkbox, Drawer, Group, Stack, Tabs, Tooltip } from '@mantine/core';
import { IconArrowCurveRight, IconLine } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useEditContentModelContext, useModelContext, usePanelContext } from '~/contexts';
import { DataPreview } from '../../data-preview';

export const PickQuery = observer(function _PickQuery() {
  const model = useModelContext();
  const content = useEditContentModelContext();
  const { panel } = usePanelContext();
  const [opened, setOpened] = useState(false);

  const navigateToQuery = (queryID: string) => {
    model.editor.setPath(['_QUERIES_', queryID]);
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Choose queries"
        padding="xl"
        size={500}
        zIndex={320}
      >
        <Checkbox.Group value={[...panel.queryIDs]} onChange={panel.setQueryIDs}>
          <Stack spacing="lg">
            {content.queries.options.map((o) => (
              <Checkbox key={o.value} label={o.label} value={o.value} />
            ))}
          </Stack>
        </Checkbox.Group>
      </Drawer>

      <Stack spacing={6}>
        <Group position="right">
          <Button variant="light" size="sm" leftIcon={<IconLine size={16} />} onClick={() => setOpened(true)}>
            Click me to choose queries for this panel
          </Button>
        </Group>
        {panel.queryIDs.length === 1 && (
          <DataPreview
            id={panel.queryIDs[0]}
            moreActions={
              <Tooltip label="Open this query">
                <ActionIcon variant="subtle" color="blue" onClick={() => navigateToQuery(panel.queryIDs[0])}>
                  <IconArrowCurveRight size={16} />
                </ActionIcon>
              </Tooltip>
            }
          />
        )}
        {panel.queryIDs.length > 1 && (
          <Tabs defaultValue={panel.queryIDs[0]}>
            <Tabs.List>
              {panel.queries.map((q) => (
                <Tabs.Tab key={q.id} value={q.id}>
                  {q.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {panel.queries.map((q) => (
              <Tabs.Panel key={q.id} value={q.id}>
                <DataPreview
                  id={q.id}
                  moreActions={
                    <Tooltip label="Open this query">
                      <ActionIcon variant="subtle" color="blue" onClick={() => navigateToQuery(q.id)}>
                        <IconArrowCurveRight size={16} />
                      </ActionIcon>
                    </Tooltip>
                  }
                />
              </Tabs.Panel>
            ))}
          </Tabs>
        )}
      </Stack>
    </>
  );
});
