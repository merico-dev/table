import { ActionIcon, Button, Group, AppShell, Text, Tooltip } from '@mantine/core';
import { IconDatabase, IconFilter, IconRoute, IconSettings } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { InteractionsViewerModal } from '~/interactions/interactions-viewer';
import { ActionIconGroupStyle } from '~/styles/action-icon-group-style';
import { ViewLinks } from './view-links';

export const DashboardEditorNavbar = observer(() => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  const openQueries = () => {
    if (!content.queries.firstID) {
      model.editor.open(['_QUERIES_', '']);
      return;
    }
    model.editor.open(['_QUERIES_', content.queries.firstID]);
  };
  const openFilters = () => {
    if (!content.filters.firstID) {
      model.editor.open(['_FILTERS_', '']);
      return;
    }
    model.editor.open(['_FILTERS_', content.filters.firstID]);
  };

  const [interactionsOpened, setInteractionsOpened] = useState(false);
  const openInteractions = () => setInteractionsOpened(true);
  const closeInteractions = () => setInteractionsOpened(false);

  return (
    <AppShell.Navbar p={0} zIndex={299}>
      <AppShell.Section>
        <Group
          grow
          gap={0}
          sx={{
            ...ActionIconGroupStyle,
            button: { borderWidth: 0, borderBottomWidth: 1, borderColor: '#e9ecef' },
          }}
        >
          <Tooltip label={t('filter.labels')} withinPortal>
            <ActionIcon variant="default" radius={0} size="md" sx={{ height: '30px' }} onClick={openFilters}>
              <IconFilter size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('query.labels')} withinPortal>
            <ActionIcon variant="default" radius={0} size="md" sx={{ height: '30px' }} onClick={openQueries}>
              <IconDatabase size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('interactions.interactions_viewer')} withinPortal>
            <ActionIcon variant="default" radius={0} size="md" sx={{ height: '30px' }} onClick={openInteractions}>
              <IconRoute size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <InteractionsViewerModal opened={interactionsOpened} close={closeInteractions} />
      </AppShell.Section>

      <AppShell.Section py={5} sx={{ borderBottom: '1px solid #eee' }}>
        <Text ta="center" sx={{ userSelect: 'none', cursor: 'default' }}>
          {t('view.labels')}
        </Text>
      </AppShell.Section>
      <AppShell.Section grow sx={{ overflow: 'auto' }}>
        <ViewLinks />
      </AppShell.Section>

      <AppShell.Section>
        <Group grow p="md" pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="xs" leftSection={<IconSettings size={20} />} onClick={() => model.editor.open([])}>
            {t('common.titles.settings')}
          </Button>
        </Group>
      </AppShell.Section>
    </AppShell.Navbar>
  );
});
