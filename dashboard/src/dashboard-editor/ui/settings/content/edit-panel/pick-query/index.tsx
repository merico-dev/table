import { ActionIcon, Button, Checkbox, Drawer, Group, Stack, Tabs, Tooltip } from '@mantine/core';
import { IconArrowCurveRight, IconLine } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useEditContentModelContext, useEditPanelContext, useEditDashboardContext } from '~/contexts';
import { DataPreview } from '../../data-preview';
import { useTranslation } from 'react-i18next';

export const PickQuery = observer(function _PickQuery() {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  const { panel } = useEditPanelContext();
  const [opened, setOpened] = useState(false);

  const navigateToQuery = (queryID: string) => {
    model.editor.setPath(['_QUERIES_', queryID]);
  };

  const count = panel.queryIDs.length;
  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('panel.settings.choose_queries')}
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
        <Group position="left">
          <Button variant="light" size="sm" leftIcon={<IconLine size={16} />} onClick={() => setOpened(true)}>
            {count === 0 ? t('panel.settings.need_to_choose_queries') : t('panel.settings.choose_queries')}
          </Button>
        </Group>
        {count === 1 && (
          <DataPreview
            id={panel.queryIDs[0]}
            moreActions={
              <Tooltip label={t('query.open')}>
                <ActionIcon variant="subtle" color="blue" onClick={() => navigateToQuery(panel.queryIDs[0])}>
                  <IconArrowCurveRight size={16} />
                </ActionIcon>
              </Tooltip>
            }
          />
        )}
        {count > 1 && (
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
                    <Tooltip label={t('query.open')}>
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
