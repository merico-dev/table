import { ActionIcon, Button, Group, Navbar as MantineNavbar, Text, Tooltip } from '@mantine/core';
import { IconDatabase, IconFilter, IconLink, IconSettings } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useModelContext } from '~/contexts';
import { DataEditorModal } from '~/definition-editor';
import { FilterSettingsModal } from '~/filter/filter-settings';
import { InteractionsViewerModal } from '~/interactions/interactions-viewer';
import { ActionIconGroupStyle } from '~/styles/action-icon-group-style';
import { ViewLinks } from './view-links';

export const DashboardEditorNavbar = observer(() => {
  const model = useModelContext();
  const [dataEditorOpened, setDataEditorOpened] = useState(false);
  const openQueries = () => {
    if (!model.queries.firstID) {
      return;
    }
    model.editor.open(['_QUERIES_', model.queries.firstID]);
  };
  const closeQueries = () => setDataEditorOpened(false);

  const [filtersOpened, setFiltersOpened] = useState(false);
  const openFilters = () => {
    if (!model.filters.firstID) {
      return;
    }
    model.editor.open(['_FILTERS_', model.filters.firstID]);
  };
  const closeFilters = () => setFiltersOpened(false);

  const [interactionsOpened, setInteractionsOpened] = useState(false);
  const openInteractions = () => setInteractionsOpened(true);
  const closeInteractions = () => setInteractionsOpened(false);

  return (
    <MantineNavbar p={0} width={{ base: 200 }}>
      <MantineNavbar.Section>
        <Group
          grow
          spacing={0}
          sx={{ ...ActionIconGroupStyle, button: { borderWidth: 0, borderBottomWidth: 1, borderColor: '#e9ecef' } }}
        >
          <Tooltip label="Filters" withinPortal>
            <ActionIcon variant="default" radius={0} size="md" disabled={!model.filters.firstID} onClick={openFilters}>
              <IconFilter size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Data Settings" withinPortal>
            <ActionIcon variant="default" radius={0} size="md" onClick={openQueries}>
              <IconDatabase size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Interactions Viewer" withinPortal>
            <ActionIcon variant="default" radius={0} size="md" onClick={openInteractions}>
              <IconLink size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <FilterSettingsModal opened={filtersOpened} close={closeFilters} />
        <DataEditorModal opened={dataEditorOpened} close={closeQueries} />
        <InteractionsViewerModal opened={interactionsOpened} close={closeInteractions} />
      </MantineNavbar.Section>

      <MantineNavbar.Section py={5} sx={{ borderBottom: '1px solid #eee' }}>
        <Text align="center" sx={{ userSelect: 'none', cursor: 'default' }}>
          Views
        </Text>
      </MantineNavbar.Section>
      <MantineNavbar.Section grow sx={{ overflow: 'auto' }}>
        <ViewLinks />
      </MantineNavbar.Section>

      <MantineNavbar.Section>
        <Group grow p="md" pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="xs" leftIcon={<IconSettings size={20} />} onClick={() => model.editor.open([])}>
            Settings
          </Button>
        </Group>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
});
